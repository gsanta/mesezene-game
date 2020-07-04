import { fade, makeStyles } from '@material-ui/core/styles';
import { TextField } from '@material-ui/core';
import * as React from 'react';
import { green, purple, red } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    margin: {
      margin: theme.spacing(1),
    },
  }));


export interface TextFieldProps {
    label: string;
    value: string;
    onChange(val: string): void;
    type?: string;
}

export function TextFieldGui(props: TextFieldProps) {
    const classes = useStylesReddit();
  
    return (
        <TextField 
            InputProps={{ classes, disableUnderline: true }}
            InputLabelProps={{
                classes: {
                  root: classes.label,
                  focused: classes.focusedLabel,
                  error: classes.erroredLabel
                }
            }}
            value={props.value}
            label={props.label}
            className={classes.margin}
            variant="filled"
            id="reddit-input"
            type={props.type || 'text'}
            onChange={e => props.onChange(e.target.value)}
        />
    )
}

const useStylesReddit = makeStyles((theme) => ({
    root: {
      border: `2px solid ${'#3ca59d'}`,
      color: '#3ca59d',
      overflow: 'hidden',
      borderRadius: 4,
      backgroundColor: 'transparent',
      transition: theme.transitions.create(['border-color', 'box-shadow']),
      '&:hover': {
        backgroundColor: 'transparent',
      },
      '&$focused': {
        backgroundColor: 'transparent',
        // boxShadow: `${fade(theme.palette.primary.main, 0.25)} 0 0 0 2px`,
        borderColor: '#3ca59d',
      },
    },
    focused: {},
    margin: {
        margin: theme.spacing(1),
        'marginLeft': 0
    },
    label: {
        "&$focusedLabel": {
          color: purple[500]
        },
        "&$erroredLabel": {
          color: "orange"
        }
      },
      focusedLabel: {},
      erroredLabel: {},
}));