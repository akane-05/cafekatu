format:
	@find . -print | grep --regex '.*\.go' | xargs goimports -w -local "github.com/akane-05/demo-app/back-app"
verify:
	@staticcheck ./... && go vet ./...
serve:
	@docker-compose -f ./docker-compose.yml up -d