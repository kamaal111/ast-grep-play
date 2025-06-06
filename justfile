PN := "pnpm"
PNR := PN + " run"

# List available commands
default:
    just --list --unsorted

# Run codemods
run:
    {{ PNR }} codemod

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

# Set up dev container. This step runs after building the dev container
[linux]
post-dev-container-create:
    just .devcontainer/post-create
    just bootstrap

# Bootstrap for CI
[linux]
bootstrap-ci: install-zsh enable-corepack install-modules

[private]
[linux]
install-zsh:
    sudo apt-get update
    sudo apt-get install -y zsh

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
