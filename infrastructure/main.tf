provider "azurerm" {
  features {}
}

locals {
  resourceGroup = "${var.product}-${var.env}"
  vaultName = "${var.product}-${var.env}"
}

data "azurerm_key_vault" "opal_key_vault" {
  name                = "${local.vaultName}"
  resource_group_name = "${local.resourceGroup}"
}

module "opal_redis" {
  source                   = "git@github.com:hmcts/cnp-module-redis?ref=master"
  product                  = var.product
  location                 = var.location
  env                      = var.env
  common_tags              = var.common_tags
  redis_version            = "6"
  business_area            = "sds"
  sku_name                 = var.redis_sku_name
  family                   = var.redis_family
  capacity                 = var.redis_capacity

  private_endpoint_enabled      = true
  public_network_access_enabled = false
}

resource "azurerm_key_vault_secret" "redis_connection_string" {
  name  = "redis-connection-string"
  value = "rediss://:${urlencode(module.opal_redis.access_key)}@${module.opal_redis.host_name}:${module.opal_redis.redis_port}?tls=true"

  key_vault_id = data.azurerm_key_vault.opal_key_vault.id
}
