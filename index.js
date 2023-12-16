document.addEventListener('DOMContentLoaded', async function() {
    let searchInputEl = document.getElementById("searchInput");
    let searchResultsEl = document.getElementById("searchResults");
    let jsonData;
    let loaderEl = document.getElementById("loader");

    function toggleLoader(show) {
        loaderEl.style.display = show ? "block" : "none";
    }

    let gridViewBtn = document.getElementById("gridViewBtn");
    let listViewBtn = document.getElementById("listViewBtn");
    let searchResultsContainer = document.getElementById("searchResults");

    gridViewBtn.addEventListener('click', function() {
        searchResultsContainer.classList.remove("list-view");
        searchResultsContainer.classList.add("grid-view");
        console.log('list');
    });

    listViewBtn.addEventListener('click', function() {
        searchResultsContainer.classList.remove("grid-view");
        searchResultsContainer.classList.add("list-view");
        console.log('grid');
    });

    function createAndAppendSearchResult(result) {
        let {
            product_image,
            product_title,
            product_badge,
            product_variants
        } = result;

        let resultItemEl = document.createElement("div");
        resultItemEl.classList.add("result-item");

        let resultItem1El = document.createElement("div");
        resultItem1El.classList.add("result-item1");
        resultItemEl.appendChild(resultItem1El);

        if (product_badge) {
            let badgeEl = document.createElement("span");
            badgeEl.textContent = product_badge;
            badgeEl.classList.add("badge-item");
            resultItem1El.appendChild(badgeEl);
        }

        let titleEl = document.createElement("img");
        titleEl.src = product_image;
        titleEl.alt = product_title;
        titleEl.classList.add("result-title-img");
        resultItem1El.appendChild(titleEl);

        let titleBreakEl = document.createElement("div");
        titleBreakEl.classList.add("result-title-container");
        resultItemEl.appendChild(titleBreakEl);

        let titleHeadingEl = document.createElement("p");
        titleHeadingEl.textContent = product_title;
        titleHeadingEl.classList.add("result-title-heading");
        titleBreakEl.appendChild(titleHeadingEl);

        let variantsEl = document.createElement("p");
        let variantsString = `${product_variants[0].v1}`;
        variantsEl.textContent = variantsString;
        titleBreakEl.appendChild(variantsEl);

        let variantsEl1 = document.createElement("p");
        let variantsString1 = `${product_variants[1].v2} `;
        variantsEl1.textContent = variantsString1;
        titleBreakEl.appendChild(variantsEl1);

        let variantsEl2 = document.createElement("p");
        let variantsString2 = ` ${product_variants[2].v3}`;
        variantsEl2.textContent = variantsString2;
        titleBreakEl.appendChild(variantsEl2);

        let variantsBreakEl = document.createElement("br");
        resultItemEl.appendChild(variantsBreakEl);

        searchResultsEl.appendChild(resultItemEl);
    }

    function displayResults(searchResults) {
        searchResultsEl.innerHTML = ""; // Clear previous results
        for (let result of searchResults) {
            createAndAppendSearchResult(result);
        }
    }

    async function fetchData() {
        try {
            toggleLoader(true);
            let response = await fetch('https://products-api-2ttf.onrender.com/api/products', {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            jsonData = await response.json(); // Assign jsonData here
            let {
                data
            } = jsonData;
            displayResults(data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            toggleLoader(false);
        }
    }

    searchInputEl.addEventListener('input', function() {
        let searchTerm = searchInputEl.value.trim().toLowerCase();
        let filteredResults = searchTerm ?
            jsonData.data.filter(result =>
                result.product_title.toLowerCase().includes(searchTerm) ||
                result.product_variants.some(variant =>
                    Object.values(variant).some(value =>
                        value.toLowerCase().includes(searchTerm)
                    )
                )
            ) :
            jsonData.data;
        displayResults(filteredResults);
    });


    await fetchData();
});