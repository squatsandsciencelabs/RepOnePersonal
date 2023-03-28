import { connect } from 'react-redux';
import * as AppStateSelectors from 'app/redux/selectors/AppStateSelectors';
import SettingsKratosPanel from 'app/features/settings/sensor/kratos/SettingsKratosPanel';

const mapStateToProps = state => ({
    isConfigFetched: AppStateSelectors.getIsConfigFetched(state),
});

const SettingsKratosScreen = connect(mapStateToProps)(SettingsKratosPanel);

export default SettingsKratosScreen;
