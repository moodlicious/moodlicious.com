#!/usr/bin/env bash

PLUGINS_DIR=.moodlicious/plugins
DOCS_DIR=src/content/plugins

rm -rf $PLUGINS_DIR
find $DOCS_DIR -depth -mindepth 1 -maxdepth 1 -type d -print0 | xargs -0 rm -rf

mkdir -p $PLUGINS_DIR

git clone --filter=blob:none --sparse https://github.com/moodlicious/moodle-local_shortlinks.git $PLUGINS_DIR/local_shortlinks
git -C $PLUGINS_DIR/local_shortlinks sparse-checkout set docs
mv $PLUGINS_DIR/local_shortlinks/docs $DOCS_DIR/local_shortlinks
