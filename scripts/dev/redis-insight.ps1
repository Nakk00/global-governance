param(
  [Parameter(Position = 0)]
  [ValidateSet("start", "stop", "status")]
  [string]$Action = "start"
)

$ErrorActionPreference = "Stop"

$ContainerName = "global-governance-redisinsight"
$Image = "redis/redisinsight:latest"
$NetworkName = "global-governance-dev"
$VolumeName = "global-governance-redisinsight"
$HostAddress = "127.0.0.1"
$HostPort = 5540

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

function Wait-RedisInsight {
  $healthUrl = "http://$($HostAddress):$($HostPort)/api/health/"

  for ($attempt = 1; $attempt -le 60; $attempt++) {
    try {
      $response = Invoke-WebRequest -UseBasicParsing -Uri $healthUrl -TimeoutSec 2
      if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 500) {
        Write-Host "Redis Insight is available at http://$($HostAddress):$($HostPort)."
        return
      }
    }
    catch {
    }

    Start-Sleep -Milliseconds 500
  }

  throw "Redis Insight did not become reachable at http://$($HostAddress):$($HostPort)."
}

Require-Command "docker" "Install Docker Desktop before starting Redis Insight."
Assert-DockerReady

switch ($Action) {
  "start" {
    $redisScript = Join-Path $PSScriptRoot "redis.ps1"
    & powershell -NoProfile -ExecutionPolicy Bypass -File $redisScript start
    if ($LASTEXITCODE -ne 0) {
      throw "Redis must be running before Redis Insight can start."
    }

    if (-not (Get-ContainerExists)) {
      Write-Host "Creating Redis Insight container $ContainerName from $Image..."
      docker run --name $ContainerName --detach --network $NetworkName --publish "$($HostAddress):$($HostPort):5540" --volume "$($VolumeName):/data" --restart unless-stopped $Image
      if ($LASTEXITCODE -ne 0) {
        throw "Redis Insight container creation failed."
      }
    }
    elseif (-not (Get-ContainerRunning)) {
      Write-Host "Starting Redis Insight container $ContainerName..."
      docker start $ContainerName
      if ($LASTEXITCODE -ne 0) {
        throw "Redis Insight container start failed."
      }
    }
    else {
      Write-Host "Redis Insight container $ContainerName is already running."
    }

    Connect-ContainerToNetwork
    Wait-RedisInsight
  }

  "stop" {
    if (-not (Get-ContainerExists)) {
      Write-Host "Redis Insight container $ContainerName does not exist."
      return
    }

    if (-not (Get-ContainerRunning)) {
      Write-Host "Redis Insight container $ContainerName is already stopped."
      return
    }

    docker stop $ContainerName
    if ($LASTEXITCODE -ne 0) {
      throw "Redis Insight container stop failed."
    }
  }

  "status" {
    if (-not (Get-ContainerExists)) {
      Write-Host "Redis Insight container $ContainerName does not exist. Run `pnpm redis:insight:start`."
      return
    }

    docker ps -a --filter "name=^/$ContainerName$" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    if ($LASTEXITCODE -ne 0) {
      throw "Unable to inspect Redis Insight container status."
    }
  }
}
