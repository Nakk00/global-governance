# Approved Sources

This folder is the repo-local staging area for approved chatbot source materials.

## Purpose

- Keep source documents out of `public/` and out of browser-facing code.
- Separate raw downloaded documents from cleaned or normalized working copies.
- Give Story 5.2 a stable place to read from before materials are uploaded to private Supabase storage.

## Structure

- `raw/`
  Store original downloaded files here, such as PDFs from official or approved sources.
- `normalized/`
  Store cleaned markdown, extracted text, or other prepared derivatives here.

## Rules

- Only place approved source materials here.
- Do not treat normalized files as separate source identities; they must map back to canonical approved `sourceId` values.
- Do not move these files into `public/`.
- Prefer clear filenames that preserve document identity and version where possible.

## Suggested Usage For Your Current Files

- Put official PDFs in `raw/`
- Put cleaned markdown notes like topic knowledge files in `normalized/`
