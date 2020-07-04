
import { createMuiTheme, withStyles, makeStyles, ThemeProvider, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { green, purple, red } from '@material-ui/core/colors';
import * as React from 'react';

export interface ButtonProps {
    children: JSX.Element | string;
    onClick(): void;
    variant: string;
    color: string;
}


// export const ButtonGui = withStyles((props: Theme & ButtonProps) => ({
//     root: {
//         color: props.palette.getContrastText(purple[500]),
//         backgroundColor: props.color1,
//         '&:hover': {
//             backgroundColor: props.color1,
//         },
//     },
// }))(Button);

export function ButtonGui(props: ButtonProps) {
    const classes = useStylesReddit();

    return (
        <Button className={props.color === 'primary' ? classes.primary : classes.secondary}>{props.children}</Button>
    )
}

const useStylesReddit = makeStyles((theme) => ({
    primary: {
        color: theme.palette.getContrastText(purple[500]),
        backgroundColor: '#e26b58',
        '&:hover': {
            backgroundColor: '#e26b58'
        },
    },

    secondary: {
        // color: theme.palette.getContrastText(purple[500]),
        color: 'white',
        backgroundColor: '#50863b',
        '&:hover': {
            backgroundColor: '#50863b'
        },
    }
}));