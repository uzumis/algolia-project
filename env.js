const config = {
	environments: [
		{
			"AEM_ENV": "local",
			"AEM_URL": "http://localhost:4502",
		},
		{
			"AEM_ENV": "dev",
			"AEM_URL": "https://publish-p111452-e1082694.adobeaemcloud.com",
		},
		{
			"AEM_ENV": "stage",
			"AEM_URL": "https://publish-p111452-e1142373.adobeaemcloud.com",
		},
		{
			"AEM_ENV": "prod",
			"AEM_URL": "https://publish-p111452-e1142340.adobeaemcloud.com",
		},
	],
	AEM_PROXY_PORT : 7001,
	AEM_SITE : "otempo",
};

module.exports = config;
