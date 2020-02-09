define BANNER
   ___|        _)                           |   
 \___ \    __|  |   _ \  __ \    _ \   __|  __| 
       |  (     |   __/  |   |   __/ \__ \  |   
 _____/  \___| _| \___| _|  _| \___| ____/ \__| 

endef
export BANNER

include .env
export $(shell sed 's/=.*//' .env)

ARG := help
DENO := /usr/bin/env deno
DENOMIG := $(DENO) --allow-env --allow-read --allow-net https://cdn.jsdelivr.net/gh/rokoucha/denomig@master/denomig.ts
FIND := /usr/bin/env find

##@ Deno tasks
.PHONY: start format denomig

start: ## Start scienest
	@$(DENO) --allow-env --allow-net --allow-read ./src/index.ts

fetch: ## Fetch dependencies
	@$(DENO) fetch ./src/index.ts

format: ## Format codes
	@$(FIND) ./src -type f -name "*.ts" -exec $(DENO) fmt {} +;

migration: ## Migration with denomig
	@$(DENOMIG) --path=./src/database/postgres/migrations ${ARG}

##@ Makefile tasks
.PHONY: banner help

banner: ## Print a banner
	@echo "$$BANNER"

# Forked from https://gist.github.com/prwhite/8168133#gistcomment-2833138
help: banner ## Help
	@awk 'BEGIN {FS = ":.*##"} /^[0-9a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-17s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

.DEFAULT_GOAL := help