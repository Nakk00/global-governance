param(
  [Parameter(Position = 0)]
  [ValidateSet("start", "stop", "status")]
  [string]$Action = "start"
)

$ErrorActionPreference = "Stop"

$ContainerName = "global-governance-redis"
$Image = "redis:7-alpine"
$NetworkName = "global-governance-dev"
$HostAddress = "127.0.0.1"
$HostPort = 6379

function Require-Command($Name, $Hint) {
  if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
    throw "$Name is required. $Hint"
  }
}

function Assert-DockerReady {
  docker info *> $null
  if ($LASTEXITCODE -ne 0) {
    throw "Docker is not running or is not reachable. Start Docker Desktop, then run this command again."
  }
}

function Get-ContainerExists {
  $names = @(docker ps -a --filter "name=^/$ContainerName$" --format "{{.Names}}")
  if ($LASTEXITCODE -ne 0) {
    throw "Unable to inspect Docker containers."
  }

  return $names -contains $ContainerName
}

function Get-ContainerRunning {
  $names = @(docker ps --filter "name=^/$ContainerName$" --format "{{.Names}}")
  if ($LASTEXITCODE -ne 0) {
    throw "Unable to inspect running Docker containers."
  }

  return $names -contains $ContainerName
}

function Ensure-Network {
  $names = @(docker network ls --filter "name=^$NetworkName$" --format "{{.Name}}")
  if ($LASTEXITCODE -ne 0) {
    throw "Unable to inspect Docker networks."
  }

  if ($names -contains $NetworkName) {
    return
  }

  docker network create $NetworkName *> $null
  if ($LASTEXITCODE -ne 0) {
    throw "Unable to create Docker network $NetworkName."
  }
}

function Connect-ContainerToNetwork {
  $networkNames = @(docker inspect --format '{{range $name, $_ := .NetworkSettings.Networks}}{{println $name}}{{end}}' $ContainerName)
  if ($LASTEXITCODE -ne 0) {
    throw "Unable to inspect Docker networks for $ContainerName."
  }

  if ($networkNames -contains $NetworkName) {
    return
  }

  docker network connect $NetworkName $ContainerName
  if ($LASTEXITCODE -ne 0) {
    throw "Unable to attach $ContainerName to Docker network $NetworkName."
  }
}

function Wait-Redis {
  for ($attempt = 1; $attempt -le 30; $attempt++) {
    $client = $null
    try {
      $client = [System.Net.Sockets.TcpClient]::new()
      $connection = $client.BeginConnect($HostAddress, $HostPort, $null, $null)
      if ($connection.AsyncWaitHandle.WaitOne(1000)) {
        $client.EndConnect($connection)
        Write-Host "Redis is reachable at redis://$($HostAddress):$($HostPort)/0."
        return
      }
    }
    catch {
    }
    finally {
      if ($client) {
        $client.Dispose()
      }
    }

    Start-Sleep -Milliseconds 500
  }

  throw "Redis did not become reachable at redis://$($HostAddress):$($HostPort)/0."
}

Require-Command "docker" "Install Docker Desktop before starting local Redis."
Assert-DockerReady

switch ($Action) {
  "start" {
    Ensure-Network

    if (-not (Get-ContainerExists)) {
      Write-Host "Creating Redis container $ContainerName from $Image..."
      docker run --name $ContainerName --detach --network $NetworkName --publish "$($HostAddress):$($HostPort):6379" --restart unless-stopped $Image
      if ($LASTEXITCODE -ne 0) {
        throw "Redis container creation failed."
      }
    }
    elseif (-not (Get-ContainerRunning)) {
      Write-Host "Starting Redis container $ContainerName..."
      docker start $ContainerName
      if ($LASTEXITCODE -ne 0) {
        throw "Redis container start failed."
      }
    }
    else {
      Write-Host "Redis container $ContainerName is already running."
    }

    Connect-ContainerToNetwork
    Wait-Redis
  }

  "stop" {
    if (-not (Get-ContainerExists)) {
      Write-Host "Redis container $ContainerName does not exist."
      return
    }

    if (-not (Get-ContainerRunning)) {
      Write-Host "Redis container $ContainerName is already stopped."
      return
    }

    docker stop $ContainerName
    if ($LASTEXITCODE -ne 0) {
      throw "Redis container stop failed."
    }
  }

  "status" {
    if (-not (Get-ContainerExists)) {
      Write-Host "Redis container $ContainerName does not exist. Run `pnpm redis:start`."
      return
    }

    docker ps -a --filter "name=^/$ContainerName$" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    if ($LASTEXITCODE -ne 0) {
      throw "Unable to inspect Redis container status."
    }
  }
}
