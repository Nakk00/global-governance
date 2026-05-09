from __future__ import annotations

from validation import repository
from validation.dtos import ValidationRunDetailDto, ValidationRunListDto, ValidationSetListDto


def list_validation_sets() -> ValidationSetListDto:
    return repository.list_validation_sets()


def list_validation_runs() -> ValidationRunListDto:
    return repository.list_validation_runs()


def get_validation_run(run_id: str) -> ValidationRunDetailDto | None:
    return repository.get_validation_run(run_id)


def launch_validation_run(*, validation_set_id: str, actor: str) -> ValidationRunDetailDto:
    return repository.launch_validation_run(validation_set_id=validation_set_id, actor=actor)
