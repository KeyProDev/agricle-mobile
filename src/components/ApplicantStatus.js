import React, {useContext} from 'react';
import {Badge, View} from 'react-native-ui-lib';
import {applicationStatusColor, recruitmentStatusColor} from '../constants/config';
import {LocalizationContext} from '../translation/translations';

const ApplicantStatus = ({ status }) => {
    const { t } = useContext(LocalizationContext);
    return (
        <View>
            {
                status === 'waiting' &&
                <Badge backgroundColor={applicationStatusColor.waiting} label={t['applicants']['status']['waiting']}/>
            }
            {
                status === 'approved' &&
                <Badge backgroundColor={applicationStatusColor.approved} label={t['applicants']['status']['approved']}/>
            }
            {
                status === 'rejected' &&
                <Badge backgroundColor={applicationStatusColor.rejected} label={t['applicants']['status']['rejected']}/>
            }
            {
                status === 'abandoned' &&
                <Badge backgroundColor={applicationStatusColor.abandoned} label={t['applicants']['status']['abandoned']}/>
            }
            {
                status === 'finished' &&
                <Badge backgroundColor={applicationStatusColor.finished} label={t['applicants']['status']['finished']}/>
            }
        </View>
    );
};

export default ApplicantStatus;
