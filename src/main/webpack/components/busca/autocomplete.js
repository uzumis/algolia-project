const Autocomplete = {

	initialize: () => {
		const { createQuerySuggestionsPlugin } = window[
			'@algolia/autocomplete-plugin-query-suggestions'
		];
		const { createLocalStorageRecentSearchesPlugin } = window[
			'@algolia/autocomplete-plugin-recent-searches'
		];
		const { autocomplete } = window['@algolia/autocomplete-js'];


		const querySuggestionsPlugin = createQuerySuggestionsPlugin({
			searchClient,
			indexName: 'test_NAME_query_suggestions',
			limit: 3,
			getSearchParams() {
				return recentSearchesPlugin.data.getAlgoliaSearchParams();
			}
		});

		const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
			key: 'instantsearch',
			limit: 5,
		});


		$('.search', function () {
			autocomplete({
				container: '#headersearch',
				openOnFocus: true,
				placeholder: 'BUSCAR',
				plugins: [recentSearchesPlugin, querySuggestionsPlugin],
				onStateChange({ state }) { // On search field update
					theTextQuery = state.query; // update the theTextQuery variable
				},
			});

			$('.algolia__container').on('click', function (e) {
				const notClear = $('.aa-ClearButton');
				notClear.css('display', 'none');

				e.preventDefault();
				$('.aa-InputWrapper').on('click', function (e) {
					e.preventDefault();
					var endUrl = "/content/gruposada/sempreeditora/otempo/resultados-de-busca.html?lorem_NAME%5Bquery%5D=" + theTextQuery;

					if (theTextQuery != '') {
						// Move the 'keydown' event handler outside of the 'click' event handler
					}
				});

				// Attach the 'keydown' event handler only once outside of the 'click' handler
				$('.aa-InputWrapper').on('keydown', function (event) {
					if (event.key === 'Enter' || event.keyCode === 13) {
						console.log(endUrl);
						window.location = endUrl;
					}
				});
				$('.aa-SubmitButton').on('click', function (e) {
					e.preventDefault();
					var endUrl = "/content/gruposada/sempreeditora/otempo/resultados-de-busca.html?lorem_NAME%5Bquery%5D=" + theTextQuery;

					if (theTextQuery != '') {
						console.log(endUrl);
						window.location = endUrl;
					}
				});
				$('.aa-DetachedSearchButton').on('click', function (e) {
					e.preventDefault();
					var endUrl = "/content/gruposada/sempreeditora/otempo/resultados-de-busca.html?lorem_NAME%5Bquery%5D=" + theTextQuery;

					if (theTextQuery != '') {
						console.log(endUrl);
						window.location = endUrl;
					}
				});
				setTimeout(function () {
					searchMobile();
				}, 1000); // 1000 ms = 1 segundo
			});

		});

	}
};
$(function () {
	if ($("#headersearch").length) {
		Autocomplete.initialize();
	}
});


function searchMobile() {
	if ($('.aa-InputWrapper').length) {
		$('.aa-InputWrapper').on('keydown', function (event) {
			if (event.key === 'Enter' || event.keyCode === 13) {
				var endUrl = "/content/gruposada/sempreeditora/otempo/resultados-de-busca.html?lorem_NAME%5Bquery%5D=" + theTextQuery;

				if (theTextQuery != '') {
					console.log(endUrl);
					window.location = endUrl;
				}
			}
		});
	}
}