# Set up the homepage

Use the openlibrary.org API client created previously to update the app homepage. The homepage should display a searchable/sortable/filterable list of books. For now, each book can just be rendered as its own JSON value, don't worry about that part of the design yet. Focus on the search/sort/filter header.

1. Pull in shadcn/ui components as needed to build this out.
2. The user should be able to enter a general search term that gets passed to the `q` param.
3. The `sort` param should be supported via a dropdown. Support `new`, `old`, `rating`, `title`, `random`, and default blank which is relevance.
4. The UI should show a dropdown of static places that can be selected. If the user picks one, the `q` passed to the API should be updated to include `place:selectedPlace` (see these search tips: <https://openlibrary.org/search/howto>)
5. Pagination should be displayed at the bottom of the page
6. Keep things clean by adding components as appropriate under `src/components`
