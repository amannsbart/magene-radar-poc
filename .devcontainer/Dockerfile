FROM docker.io/oven/bun:alpine

# Install bash, curl, ssh-keygen (needed for Starship install)
RUN apk add --no-cache bash curl openssh

# Install Starship
RUN curl -fsSL https://starship.rs/install.sh | sh -s -- --yes

# Create Starship config directory
RUN mkdir -p /root/.config

# Copy starship.toml from build context (the .devcontainer folder) to the config directory
COPY starship.toml /root/.config/starship.toml

# Set STARSHIP_CONFIG env variable to point to the config file
ENV STARSHIP_CONFIG=/root/.config/starship.toml

# Initialize Starship in Bash for all users
RUN echo 'eval "$(starship init bash)"' >> /root/.bashrc
