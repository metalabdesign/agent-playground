I want to integrate the openlibrary.org API into this application.

1. The homepage should be updated to display a searchable/sortable/filterable list of books. This should use the <https://openlibrary.org/dev/docs/api/search> endpoint.
2. The user should be able to enter a general search term that gets passed to the `q` param.
3. The `sort` param should be supported via a dropdown. Support `new`, `old`, `rating`, `title`, `random`, and default blank which is relevance.
4. The UI should show a dropdown of static places that can be selected. If the user picks one, the `q` should be updated to include `place:selectedPlace` (see these search tips: https://openlibrary.org/search/howto)
5. Display pagination at the bottom of the results.
6. Make a simple API client for Open Library under `src/lib/openLibrary/Client.ts`. Expose an instance to the React app with a simple provider/context.
7. Search query data should be persisted to and read from the query string, so users can reload and share their searches.
8. Pull in shadcn/ui components to build this page out.
