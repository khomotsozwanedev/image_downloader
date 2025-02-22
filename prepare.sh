#!/bin/bash

# 🌈 Welcome to the Magical Download Script! 🌟

# Log file
log_file="$HOME/download_script.log"

# Function to log messages with timestamp
log() {
    timestamp=$(date +"%Y-%m-%d %H:%M:%S")
    echo "[$timestamp] $*" >> "$log_file"  # Append to log file
    echo "[$timestamp] $*"  # Also print to console (real-time)
}

# Function to display help
help() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --url <URL>            The base URL for downloads (required if --isPaginated is false)."
    echo "  --isPaginated          Flag indicating paginated downloads (default: false)."
    echo "  --paginatedUrl <URL>   URL for paginated downloads (required if --isPaginated is true)."
    echo "  --directoryPath <PATH> Directory to save downloads (default: $HOME/downloader)."
    echo "  --storageBucketUri <URI> GCP storage bucket URL."
    echo "  --isStorageBucket      Flag indicating if the target is a storage bucket (default: false)."
    echo "  --help                 Display this help message."
    echo "  --version              Display script version."
    exit 0
}

# Function to display version
version() {
    echo "Download Script Version 1.0.2"  # Update version as needed
    exit 0
}

# Default values
isPaginated=false  # Default to false
directoryPath="$HOME/downloader" # Default directory
url=""  # No default, conditionally required
paginatedUrl="" # No default, conditionally required
storageBucketUri="" # No default, conditionally required
isStorageBucket=false # Default to false

log "🚀 Script started! ✨"

# ⚙️ Parsing command-line arguments...
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --url) url="$2"; shift ;;
        --isPaginated) isPaginated=true; shift ;;  # No need for $2, it's a flag
        --paginatedUrl) paginatedUrl="$2"; shift ;;
        --directoryPath) directoryPath="$2"; shift ;;
        --storageBucketUri) storageBucketUri="$2"; shift ;;
        --isStorageBucket) isStorageBucket=true; shift ;;  # No need for $2, it's a flag
        --help) help ;;  # Call help function
        --version) version ;; # Call version function
        *) log "❌ Unknown parameter passed: $1 🚫"; exit 1 ;;
    esac
    shift
done

# 🧐 Checking for required parameters...
if [ "$isStorageBucket" = true ]; then
    if [ -z "$storageBucketUri" ]; then
        log "⚠️ storageBucketUri is required when --isStorageBucket is used. Please provide it with --storageBucketUri. 🔗"
        help # Show help message and exit
    fi
else
    if [ "$isPaginated" = false ]; then  # URL is required only if NOT paginated
        if [ -z "$url" ]; then
            log "⚠️ URL is required when --isPaginated is NOT used. Please provide it with --url. 🔗"
            help # Show help message and exit
        fi
    elif [ "$isPaginated" = true ]; then # Paginated URL is required if PAGINATED
        if [ -z "$paginatedUrl" ]; then
            log "⚠️ Paginated URL is required when --isPaginated is used. Please provide it with --paginatedUrl. 🔗"
            help
            exit 1
        fi
        if [ -z "$url" ]; then
            log "⚠️ Base URL is required when --isPaginated is used. Please provide it with --url. 🔗"
            help
            exit 1
        fi
    fi
fi

# 📂 Creating the directory (if it doesn't exist)...
log "📁 Creating download directory: $directoryPath..."
mkdir -p "$directoryPath"
if [ ! -d "$directoryPath" ]; then
    log "🔥 Failed to create directory: $directoryPath 💥"
    exit 1
fi
log "📁 Download directory set to: $directoryPath ✅"

# 🚀 Calling the Node.js app...
nodejs_app="./dist/index.js" # 📍 

log "✨ Calling Node.js app: $nodejs_app..."

# Corrected the conditional logic for calling the Node.js app
if [ "$isStorageBucket" = true ]; then
    node "$nodejs_app" "storageBucketUri=$storageBucketUri" "isStorageBucket=$isStorageBucket"
elif [ "$isPaginated" = true ]; then
    node "$nodejs_app" "url=$url" "isPaginated=$isPaginated" "paginatedUrl=$paginatedUrl" "directoryPath=$directoryPath"
else
    node "$nodejs_app" "url=$url" "isPaginated=$isPaginated" "directoryPath=$directoryPath"
fi

# 🎁 Capturing the output...
output=$(node "$nodejs_app" "url=$url" "isPaginated=$isPaginated" "paginatedUrl=$paginatedUrl" "directoryPath=$directoryPath" "storageBucketUri=$storageBucketUri" "isStorageBucket=$isStorageBucket")

log "✨ Node.js App Output: ✨"
echo "$output" # Print to console *and* log file

# 🚦 Checking the result...
exit_code=$?
if [ $exit_code -eq 0 ]; then
    log "🎉 Success! Download complete! 🥳"
else
    log "😭 Oh no! Download failed! 💔 Exit code: $exit_code"
fi

log "✨ Script finished! ✨"
