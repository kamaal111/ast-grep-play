PN := "pnpm"
PNR := PN + " run"

# List available commands
default:
    just --list --unsorted

# Run codemods
run:
    {{ PNR }} codemod

# Test codemods
test:
    {{ PNR }} test

# Test codemods and add snapshots interactively
test-snap-i:
    {{ PNR }} test:snap-i

# Test codemods with snapshots skipped
test-no-snap:
    {{ PNR }} test:no-snap

# Format code
format:
    {{ PNR }} format

# Check code formatting
format-check:
    {{ PNR }} format:check

# Install dependencies
install-modules:
    #!/bin/zsh

    . ~/.zshrc || true

    echo "Y" | pnpm i

# Bootstrap project
bootstrap: install-node enable-corepack install-modules

[private]
install-node:
    #!/bin/zsh

    curl -fsSL https://fnm.vercel.app/install | bash

    . ~/.zshrc || true

    fnm completions --shell zsh
    fnm install

[private]
enable-corepack:
    #!/bin/zsh

    . ~/.zshrc || true

    corepack enable
