timestamp=$(shell date --iso-8601=seconds --utc)

default: info

check-platform:
ifeq ($p, )
	@echo "-------------------------------------------"
	@echo "Make variable p isn't set"
	@echo "Usage  : make COMMAND p=PLATFORM"
	@echo "Example: make update  p=demo|develop|tiradeio"
	@echo "-------------------------------------------"
	@exit 1
endif

extport1:=451

get-platform: check-platform
container:=pbx-tirade2-unknown
ifeq ($p, demo)
container:=pbx-tirade2-prod
endif
ifeq ($p, develop)
container:=pbx-tirade2-develop
extport1:=448
endif
ifeq ($p, tiradeio)
container:=pbx-tirade2-prod
endif

info:
	@echo "Usage  : make TARGET p=PLATFORM"
	@echo "Example: make update p=demo"
	@echo "PLATFORM list: demo, develop, tiradeio"
	@echo
	@echo "Makefile targets:"
	@echo "Main: deploy   (one-shot deploy command)"
	@echo "      update   (one-shot safe redeploy command: undeploy, \
git pull, deploy, saving logs)"
	@echo "      undeploy (one-shot undeploy command, erasing deploy \
evidences)"
	@echo "      redeploy (one-shot less safe redeploy command, saving logs)"
	@echo "      restart  (one-shot restart command, saving logs)"
	@echo "      drop-wrecks (one-shot command, erasing failed container, \
image)"
	@echo "      clean    (one-shot command, erasing the container logs)"
	@echo "      clean-all(one-shot command, erasing all current dir logs)"
	@echo
	@echo "All: info, version, deploy-pre-check, deploy-post-check, \
undeploy-pre-check, undeploy-post-check, build-image, rm-image, run-container, \
deploy, rm-container, stop-container, undeploy, is-running, drop-wrecks, \
save-logs, show-logs, update, redeploy, restart-container, restart, \
clean, clean-all"

version:
	@echo "v4.1 based"

deploy-pre-check:
	@if [ "`$(MAKE) --no-print-directory is-running`" = Yes ]; then echo "Looks like ${container} already deployed, aborting."; exit 1; fi

deploy-post-check:
	@if [ "`$(MAKE) --no-print-directory is-running`" = No ]; then echo "${container} deploy failure"; exit 1; else echo "${container} deployed"; fi

undeploy-pre-check:
	@if [ "`$(MAKE) --no-print-directory is-running`" = No ]; then echo "Looks like ${container} not deployed, aborting."; exit 1; fi

undeploy-post-check:
	@if [ "`$(MAKE) --no-print-directory is-running`" = Yes ]; then echo "${container} undeploy failure"; exit 1; else echo "${container} undeployed"; fi

build-image:
ifeq ($p, demo)
	@sed 's/NGINXCONFIGDIR/nginx\_config/g' Dockerfile.tpl > Dockerfile.${p}
	@echo "REACT_APP_API_URL=wss://pbxcore.rtclogic.com/socket"  > .env
	@echo "          API_URL=wss://pbxcore.rtclogic.com/socket" >> .env
endif
ifeq ($p, develop)
	@sed 's/NGINXCONFIGDIR/nginx\_config/g' Dockerfile.tpl > Dockerfile.${p}
endif
ifeq ($p, tiradeio)
	@sed 's/NGINXCONFIGDIR/nginx\_config\.test/g' Dockerfile.tpl > Dockerfile.${p}
	@echo "REACT_APP_API_URL=wss://test.tirade.io/socket"  > .env
	@echo "          API_URL=wss://test.tirade.io/socket" >> .env
endif
	@docker build -t ${container} -f Dockerfile.${p} .

rm-image: get-platform
	@docker rmi ${container}

run-container: build-image
	@docker run --name ${container} --restart=always -p ${extport1}:443 \
-e BUILD_TIMESTAMP=${timestamp} -e NODE_NAME=${container} -d ${container}

deploy: get-platform deploy-pre-check run-container deploy-post-check

rm-container:
	@docker rm ${container}

stop-container:
	@docker stop ${container}

undeploy: get-platform undeploy-pre-check stop-container rm-container rm-image clean undeploy-post-check

is-running:
	@docker ps | grep -q ${container} && echo -n Yes || echo -n No

drop-wrecks: rm-container rm-image

save-logs:
	docker logs ${container} >> ${container}-`date --utc '+%Y%m%d-%H%M%S'`.log
	@echo "You can execute 'make show-logs' to read the logs"

show-logs: get-platform
	@cat ${container}-*.log | less --

update: save-logs undeploy
	git pull
	$(MAKE) deploy p=${p}

redeploy: get-platform save-logs undeploy deploy

restart-container: get-platform
	@docker restart ${container}

restart: get-platform save-logs restart-container

clean: get-platform
	@rm -f ${container}-*.log

clean-all:
	@rm -f *.log
