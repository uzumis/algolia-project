import { createDropdown } from './algolia-dropdown';
import instantsearch from 'instantsearch.js';
import historyRouter from 'instantsearch.js/es/lib/routers/history';
import {
  connectSearchBox,
  connectPagination
}
  from 'instantsearch.js/es/connectors';
import {
  hierarchicalMenu,
  stats,
  refinementList,
  clearRefinements,
  numericMenu,
  configure,
  hits,
  pagination,
  sortBy
} from 'instantsearch.js/es/widgets';

$('.autocomplete__prefs').on('click', function () {
  const notClear = $('.aa-ClearButton');
  notClear.css('display', 'none');
});
const Instantsearch = {
  initialize: () => {
    const { createQuerySuggestionsPlugin } = window[
      '@algolia/autocomplete-plugin-query-suggestions'
    ];
    const { createLocalStorageRecentSearchesPlugin } = window[
      '@algolia/autocomplete-plugin-recent-searches'
    ];
    const { autocomplete } = window['@algolia/autocomplete-js'];
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const instantSearchRouter = historyRouter();
    let statQuery;
    statQuery = "sua busca";
    let initialUiState = { instant_search: {} };
    if (urlParams.has("search")) {
      initialUiState = {
        'lorem_NAME': { query: urlParams.get("search") }
      };
    }
    const search = instantsearch({
      indexName: 'lorem_NAME',
      searchClient,
      routing: instantSearchRouter,
      insights: true,
      filters: `date_timestamp = 1647534058`,
      initialUiState
    });
    const querySuggestionsPlugin = createQuerySuggestionsPlugin({
      searchClient,
      indexName: 'test_NAME_query_suggestions',
      getSearchParams() {
        // This creates a shared `hitsPerPage` value once the duplicates
        // beftween recent searches and Query Suggestions are removed.
        return recentSearchesPlugin.data.getAlgoliaSearchParams({
          hitsPerPage: 6,
        });
      },
      transformSource({ source }) {
        return {
          ...source,
          sourceId: 'querySuggestionsPlugin',
          getItemUrl({ item }) {
            return getItemUrl({
              query: item.query,
            });
          },
          onSelect({ setIsOpen, setQuery, event, item }) {
            onSelect({
              setQuery,
              setIsOpen,
              event,
              query: item.query,
            });
          },
          getItems(params) {
            if (!params.state.query) {
              return [];
            }

            return source.getItems(params);
          },
          templates: {
            ...source.templates,
            item(params) {
              const { children } = source.templates.item(params).props;

              return createItemWrapperTemplate({
                query: params.item.label,
                children,
                html: params.html,
              });
            },
          },
        };
      },
    });
    const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
      key: 'instantsearch',
      limit: 3,
      transformSource({ source }) {
        return {
          ...source,
          getItemUrl({ item }) {
            return getItemUrl({
              query: item.label,
            });
          },
          onSelect({ setIsOpen, setQuery, item, event }) {
            onSelect({
              setQuery,
              setIsOpen,
              event,
              query: item.label,
            });
          },
          // Update the default `item` template to wrap it with a link
          // and plug it to the InstantSearch router.
          templates: {
            ...source.templates,
            item(params) {
              const { children } = source.templates.item(params).props;


              return createItemWrapperTemplate({
                query: params.item.label,
                children,
                html: params.html,
              });
            },
          },
        };
      },
    });
    const virtualSearchBox = connectSearchBox(() => { console.log("Searchbox Inicializado"); });
    const dateFilter = createDropdown(
      numericMenu,
      {
        buttonText: 'Data',
      },
      {
        closeOnChange: true,
      }
    );
    const refinementListDropdown = createDropdown(
      refinementList,
      {
        buttonText: 'Editoria',
      },
      { closeOnChange: true, }
    );
    const autorDropdown = createDropdown(
      hierarchicalMenu,
      {
        buttonText: 'Autor(a)',
      }
    );
    const searchPageState = getInstantSearchUiState();
    const renderCustomPagination = (renderOptions) => {
      const {
        currentRefinement,
        nbPages,
        isFirstPage,
        isLastPage,
        refine,
      } = renderOptions;

      const container = document.querySelector('#pagination');

      let paginationHTML = `
     
        <ul class="pagination__list">
        ${isFirstPage
          ? `<li class="pagination__item">
                 <button class="pagination__button button button__outline button--md button__prev"
                   href="#"
                   aria-label="Anterior"
                   data-page="${currentRefinement - 1}"
                 disabled>
                   Anterior
                 </button>
               </li>
               <div class="pagination__info">
    Página ${currentRefinement + 1} de ${nbPages}
  </div>`
          : ''
        }
          ${!isFirstPage
          ? `<li class="pagination__item">
                 <a class="pagination__button button button__outline button--md button__prev"
                   href="#"
                   aria-label="Anterior"
                   data-page="${currentRefinement - 1}"
                 >
                   Anterior
                 </a>
               </li>
               <div class="pagination__info">
                Página ${currentRefinement + 1} de ${nbPages}
              </div>`
          : ''
        }
        <span class="algolia__pagination-container" style="display: contents">
          <li class="pagination__item pagination__pages-list">
            <a class="pagination__link ${currentRefinement === 0 ? 'active' : ''}"
              href="#"
              data-page="0"
            >
              1
            </a>
          </li>
      `;

      if (currentRefinement > 3) {
        paginationHTML += `
          <li class="pagination__item">
            <span class="pagination__dots">...</span>
          </li>
        `;
      }

      for (let page = Math.max(currentRefinement - 1, 1); 
      page <= Math.min(currentRefinement + 1, nbPages - 2); page++) {
        paginationHTML += `
          <li class="pagination__item pagination__pages-list">
            <a class="pagination__link ${currentRefinement === page ? 'active' : ''}"
              href="#"
              data-page="${page}"
            >
              ${page + 1}
            </a>
          </li>
        `;
      }

      if (currentRefinement < nbPages - 4) {
        paginationHTML += `
          <li class="pagination__item">
            <span class="pagination__dots">...</span>
          </li>
        `;
      }

      if (nbPages > 1) {
        paginationHTML += `
          <li class="pagination__item pagination__pages-list">
            <a class="pagination__link ${currentRefinement === nbPages - 1 ? 'active' : ''}"
              href="#"
              data-page="${nbPages - 1}"
            >
              ${nbPages}
            </a>
          </li>
       </span>
        `;
      }

      paginationHTML += `
      ${isLastPage
          ? `<li class="pagination__item">
               <button class="pagination__button button button__outline button--md button__next"
                 href="#"
                 aria-label="Próxima"
                 data-page="${currentRefinement - 1}"
               disabled>
                 Próxima
               </button>
             </li>`
          : ''
        }
        ${!isLastPage
          ? `<li class="pagination__item">
              <a class="pagination__button button button__outline button--md button__next"
                href="#"
                aria-label="Próxima"
                data-page="${currentRefinement + 1}"
              >
                Próxima
              </a>
            </li>`
          : ''
        }
        </ul>
      `;

      container.innerHTML = paginationHTML;

      [...container.querySelectorAll('a')].forEach(element => {
        element.addEventListener('click', event => {
          event.preventDefault();
          refine(parseInt(event.currentTarget.getAttribute('data-page'), 10));
        });
      });
    };
    const customPagination = connectPagination(renderCustomPagination);
    let skipInstantSearchUiStateUpdate = false;
    statQuery = searchPageState.query || '';
    const { setQuery } = autocomplete({
      container: '#autocomplete',
      placeholder: 'BUSCAR',
      detachedMediaQuery: 'none',
      plugins: [recentSearchesPlugin, querySuggestionsPlugin],
      initialState: {
        query: searchPageState.query || '',
      },

      onSubmit({ state }) {
        setInstantSearchUiState({ query: state.query });
      },
      onReset() {
        setInstantSearchUiState({ query: '' });
      },
      onStateChange({ prevState, state }) {
        if (!skipInstantSearchUiStateUpdate && prevState.query !== state.query) {
          setInstantSearchUiState({ query: state.query });
          statQuery = state.query;
        }
        skipInstantSearchUiStateUpdate = false;
      },
    });

    search.addWidgets([
      virtualSearchBox({
      }),
      dateFilter({
        container: '#date',
        attribute: 'date_timestamp',
        items: [
          { label: 'Todos os dias' },
          { label: 'Últimos 7 dias', start: daysBefore(7) },
          { label: 'Últimos 30 dias', start: daysBefore(30) },
          { label: 'Últimos 90 dias', start: daysBefore(90) },
          { label: 'Último ano', start: daysBefore(365) },
          { label: 'Últimos 2 anos', start: daysBefore(730) },
        ],
      }),
      sortBy({
        container: '#organizarpor',
        items: [{ label: 'Mais recentes', value: 'lorem_NAME' },
        { label: 'Mais populares', value: 'lorem_NAME_popular' },
        ],
      }),

      refinementListDropdown({
        container: '#editoria', // the CSS Selector of the DOM element inside which the widget is inserted.
        attribute: 'editoria',  // the name of the attribute in the records.
      }),
      autorDropdown({
        container: '#autor',
        attributes: [
          'autor.lvl0',
          'autor.lvl1',
        ],
      }),

      hits({
        container: '#hits',
        templates: {
          item: (hit, { html, components }) => html`
          <div class="search-results">
								<div class="search-results__texto">
									<p class="search-results__texto--chamada">
                  ${components.Highlight({ hit, attribute: 'versal' })}</p>
									<p class="search-results__texto--title">
                  ${components.Highlight({ hit, attribute: 'titulo' })}</p>
									<p class="search-results__texto--subtitle">
                  ${components.Highlight({ hit, attribute: 'chamada' })}</p>
                  </div>
                  <div class="search-results__img">
                  <img src="${hit.urlImagem}" alt="Imagem Destaque"/>
                  </div>
					</div>
        `,
          empty(results, { html }) {
            return html``;
          },
        },
      }),
      configure({
        hitsPerPage: 8,
      }),
      pagination({
        container: '#pagination',
      }),
      customPagination({
        container: $('#pagination'),
      }),
      stats({
        container: '#stats',
        templates: {
          text(data, { html }) {
            let count = '';
            if (data.hasNoResults) {
              count += `Não foi possivel encontrar`;
            }
            if (data.hasManyResults) {
              count += `${data.nbHits} resultados `;
            } else if (data.hasOneResult) {
              count += `1 resultado `;
            }

            if (statQuery == "") {
              statQuery = "página O Tempo";
            }
            console.log(urlParams.get("query"));
            return html`${count} relacionados a "${statQuery}".`;

          },
        },
      }),
      clearRefinements({
        container: '#clear-refinements',
        includedAttributes: ['editoria', 'autor.lvl0',
          'autor.lvl1', 'date_timestamp'],
        templates: {
          resetLabel({ hasRefinements }, { html }) {
            return html`<span>${hasRefinements ? 'Limpar' : 'Limpar'}</span>`;
          },
        },
      }),
    ]);
    search.start();

    function daysBefore(days) {
      const currentDate = new Date();
      const pastDate = new Date(currentDate);
      pastDate.setDate(currentDate.getDate() - days);
      console.log(Math.floor(pastDate.getTime() / 1000));
      return Math.floor(pastDate.getTime() / 1000);
    }
    function setInstantSearchUiState(indexUiState) {
      search.setUiState(uiState => ({
        ...uiState,
        ['lorem_NAME']: {
          ...uiState['lorem_NAME'],
          page: 1,
          ...indexUiState,
        },
      }));
    }
    function isModifierEvent(event) {
      const isMiddleClick = event.button === 1;
      return (
        isMiddleClick ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey
      );
    }
    function onSelect({ setIsOpen, setQuery, event, query }) {

      // You want to trigger the default browser behavior if the event is modified.
      if (isModifierEvent(event)) {

        return;
      }

      setQuery(query);

      setIsOpen(false);

      setInstantSearchUiState({ query });
    }
    function getItemUrl({ query }) {

      return getInstantSearchUrl({ query });

    }
    function createItemWrapperTemplate({ children, query, html }) {

      const uiState = { query };

      return html`<a
        class="aa-ItemLink"
        href="${getInstantSearchUrl(uiState)}"
        onClick="${(event) => {
          if (!isModifierEvent(event)) {
            // Bypass the original link behavior if there's no event modifier
            // to set the InstantSearch UI state without reloading the page.
            event.preventDefault();
          }
        }}"
      >
        ${children}
      </a>`;
    }
    function getInstantSearchUrl(indexUiState) {
      return search.createURL({ ['lorem_NAME']: indexUiState });
    }
    function getInstantSearchUiState() {

      const uiState = instantSearchRouter.read();

      return (uiState && uiState['lorem_NAME']) || {};
    }
    window.addEventListener('popstate', () => {
      skipInstantSearchUiStateUpdate = true;
      setQuery(search.helper?.state.query || '');


    });

  },
};

$(function () {
  if ($("#autocomplete").length) {
    Instantsearch.initialize();
  }
});
