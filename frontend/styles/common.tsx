import { StyleSheet } from 'react-native';
import { Theme} from '../constants/theme';
import fonts from '../constants/fonts';
import spacing from '../constants/spacing';

const styles = StyleSheet.create({
    normalView:{
        padding: spacing*2,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }, 
    mainTitle: {
        fontFamily: fonts.CocoSharp,
        fontSize: Theme.size.xl,
        color: Theme.colors.bamxGreen,
        marginBottom: spacing*1.2,
        textAlign: 'center',
    },
    subTitle: {
        fontFamily: fonts.PoppinsMedium,
        fontWeight: '600',
        fontSize: Theme.size.md,
        color: Theme.colors.bamxGrey,
        marginBottom: spacing-3,
    },
    btn: {
        padding: spacing - 5,
        width: '60%',
        alignSelf: 'center',
        backgroundColor: Theme.colors.bamxRed,
        borderRadius: spacing,
        marginTop: spacing,
        ...Theme.shadows.shadow,
    },
    btnText:{
        fontFamily: fonts.PoppinsSemiBold,
        fontWeight: '700',
        fontSize: Theme.size.aftm,
        textAlign: 'center',
        color: Theme.colors.white,
    }
})