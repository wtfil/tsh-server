# tsh

Tool for sharing terminal session over http

## limitations

`tsh` using the `script` commant for capture terminal. Because of this, there are limitations to environment.

OS:
- OSX - supported
- Linux - not tested
- Windows - not working

Also `tsh` has not support for special characters yet:
- arrrows
- backspace
- output that could change over the time (like VIM)

## install

	npm install -g tsh

## usage

	tsh
