import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {
    RecruitmentList,
    RecruitmentApplicants,
    RecruitmentApplicant,
    RecruitmentDetail,
    RecruitmentResult,
    RecruitmentReview,
    RecruitmentCreate,
    RecruitmentEdit,
    RecruitmentPreview, RecruitmentAddon
} from '../index';
const Stack = createStackNavigator();

const Index = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen name={'RecruitmentList'} component={RecruitmentList} />
            <Stack.Screen name={'RecruitmentApplicants'} component={RecruitmentApplicants} />
            <Stack.Screen name={'RecruitmentApplicant'} component={RecruitmentApplicant} />
            <Stack.Screen name={'RecruitmentDetail'} component={RecruitmentDetail} />
            <Stack.Screen name={'RecruitmentResult'} component={RecruitmentResult} />
            <Stack.Screen name={'RecruitmentReview'} component={RecruitmentReview} />
            <Stack.Screen name={'RecruitmentCreate'} component={RecruitmentCreate} />
            <Stack.Screen name={'RecruitmentEdit'} component={RecruitmentEdit} />
            <Stack.Screen name={'RecruitmentPreview'} component={RecruitmentPreview} />
            <Stack.Screen name={'RecruitmentAddon'} component={RecruitmentAddon} />
        </Stack.Navigator>
    );
};

export default Index;
