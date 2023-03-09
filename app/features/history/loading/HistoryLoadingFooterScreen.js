import { connect } from 'react-redux';
import * as HistorySelectors from 'app/redux/selectors/HistorySelectors';
import ListLoadingFooter from './ListLoadingFooter';

const mapStateToProps = state => ({
    isLoading: HistorySelectors.getIsLoading(state),
    isLargeFooter: true,
});

const HistoryLoadingFooterScreen = connect(mapStateToProps)(ListLoadingFooter);

export default HistoryLoadingFooterScreen;
