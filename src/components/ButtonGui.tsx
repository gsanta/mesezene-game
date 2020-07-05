
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

export function ButtonGui(props: ButtonProps) {
    const classes = useStylesReddit();

    return (
        <Button className={props.color === 'primary' ? classes.primary : classes.secondary} onClick={props.onClick}>{props.children}</Button>
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
        color: 'white',
        backgroundColor: '#50863b',
        '&:hover': {
            backgroundColor: '#50863b'
        },
    }
}));