import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import {
  Link as RouterLink,
  Switch,
  useHistory,
  useRouteMatch,
} from 'react-router-dom';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { NO_VALUE_FALLBACK } from '@commercetools-frontend/constants';
import {
  usePaginationState,
  useDataTableSortingState,
} from '@commercetools-uikit/hooks';
import { BackIcon } from '@commercetools-uikit/icons';
import Constraints from '@commercetools-uikit/constraints';
import FlatButton from '@commercetools-uikit/flat-button';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import DataTable from '@commercetools-uikit/data-table';
import { ContentNotification } from '@commercetools-uikit/notifications';
import { Pagination } from '@commercetools-uikit/pagination';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import messages from './messages';
import { useCartsFetcher } from '../../hooks/use-carts-connector';
import { getErrorMessage } from '../../helpers';

const columns = [
  { key: 'customerEmail', label: 'Customer email' },
  { key: 'key', label: 'Key'},
    { key: 'country', label: 'Country'},
    { key: 'createdAt', label: 'Creation date',isSortable: true}

];

const itemRenderer = (item, column) => {
      return item[column.key];
};

const Carts = (props) => {
  const intl = useIntl();
  const match = useRouteMatch();
  const { push } = useHistory();
  const { page, perPage } = usePaginationState();
  const tableSorting = useDataTableSortingState({ key: 'createdAt', order: 'desc' });
  const { dataLocale, projectLanguages } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale,
    projectLanguages: context.project.languages,
  }));
  const { cartsPaginatedResult, error, loading } = useCartsFetcher({
    page,
    perPage,
    tableSorting,
  });

  if (error) {
    return (
      <ContentNotification type="error">
        <Text.Body>{getErrorMessage(error)}</Text.Body>
      </ContentNotification>
    );
  }

  return (
    <Spacings.Stack scale="xl">
      <Spacings.Stack scale="xs">
        <FlatButton
          as={RouterLink}
          to={props.linkToWelcome}
          label={intl.formatMessage(messages.backToWelcome)}
          icon={<BackIcon />}
        />
        <Text.Headline as="h2" intlMessage={messages.title} />
      </Spacings.Stack>

      <Constraints.Horizontal max={13}>
        <ContentNotification type="info">
          <Text.Body intlMessage={messages.demoHint} />
        </ContentNotification>
      </Constraints.Horizontal>

      {loading && <LoadingSpinner />}

      {cartsPaginatedResult ? (
        <Spacings.Stack scale="l">
          <DataTable
            isCondensed
            columns={columns}
            rows={cartsPaginatedResult.results}
            itemRenderer={(item, column) =>
              itemRenderer(item, column)
            }
            sortedBy={tableSorting.value.key}
            sortDirection={tableSorting.value.order}
            onSortChange={tableSorting.onChange}
            onRowClick={(row) => push(`${match.url}/${row.id}`)}
          />
          <Pagination
            page={page.value}
            onPageChange={page.onChange}
            perPage={perPage.value}
            onPerPageChange={perPage.onChange}
            totalItems={cartsPaginatedResult.total}
          />

        </Spacings.Stack>
      ) : null}
    </Spacings.Stack>
  );
};
Carts.displayName = 'Carts';
Carts.propTypes = {
  linkToWelcome: PropTypes.string.isRequired,
};

export default Carts;
