import {useMcQuery} from "@commercetools-frontend/application-shell";
import FetchCartsQuery from "../use-carts-connector/fetch-carts.ctp.graphql";
import {GRAPHQL_TARGETS} from "@commercetools-frontend/constants";

export const useCartsFetcher = ({ page, perPage, tableSorting }) => {
    const { data, error, loading } = useMcQuery(FetchCartsQuery, {
        variables: {
            limit: perPage.value,
            offset: (page.value - 1) * perPage.value,
            sort: [`${tableSorting.value.key} ${tableSorting.value.order}`],
        },
        context: {
            target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
        },
    });

    return {
        cartsPaginatedResult: data?.carts,
        error,
        loading,
    };
};
