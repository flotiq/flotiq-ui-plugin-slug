import { registerFn } from '../common/plugin-element-cache';
import pluginInfo from '../plugin-manifest.json';
import i18n from '../i18n';

import cssString from 'inline:./styles/style.css';

import { handleManagePlugin } from './manage-form';
import { handleFormFieldConfig } from './field-config';
import { handleMigrate } from './migrations';
import { handleFormFieldListenersAdd } from './field-listeners';

registerFn(
  pluginInfo,
  (handler, _client, { getPluginSettings, getLanguage }) => {
    /**
     * Add plugin styles to the head of the document
     */
    if (!document.getElementById(`${pluginInfo.id}-styles`)) {
      const style = document.createElement('style');
      style.id = `${pluginInfo.id}-styles`;
      style.textContent = cssString;
      document.head.appendChild(style);
    }

    const language = getLanguage();
    if (language !== i18n.language) {
      i18n.changeLanguage(language);
    }

    handler.on('flotiq.plugins.manage::form-schema', (data) =>
      handleManagePlugin(data),
    );

    handler.on('flotiq.form.field::config', (data) =>
      handleFormFieldConfig(data, getPluginSettings),
    );

    handler.on('flotiq.form.field.listeners::add', (data) =>
      handleFormFieldListenersAdd(data, getPluginSettings),
    );

    handler.on('flotiq.language::changed', ({ language }) => {
      if (language !== i18n.language) {
        i18n.changeLanguage(language);
      }
    });

    handler.on('flotiq.plugin::migrate', handleMigrate);
  },
);
