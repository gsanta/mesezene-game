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

export function TextFieldGui(props) {
    const classes = useStylesReddit();
  
    return (
        <TextField 
            InputProps={{ classes, disableUnderline: true }}
            InputLabelProps={{
                classes: {
                  root: classes.label,
                  focused: classes.focusedLabel,
                  error: classes.erroredLabel
                },
            }}
            label="Reddit"
            className={classes.margin}
            defaultValue="react-reddit"
            variant="filled"
            id="reddit-input"
        />
    )
}

const useStylesReddit = makeStyles((theme) => ({
    root: {
      border: '2px solid #e4d76c',
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
        borderColor: purple[500],
      },
    },
    focused: {},
    margin: {
        margin: theme.spacing(1),
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