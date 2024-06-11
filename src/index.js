import { registerFn } from "./common/plugin-helpers";
import { handleManagePlugin, loadManagePlugin } from "./plugins/managePlugin";
import { handleFormFieldConfig } from "./plugins/formFieldConfig";
import { handleMigrate } from "./plugins/migrate";
import pluginInfo from "./plugin-manifest.json";

/* eslint import/no-webpack-loader-syntax: off */
import cssString from "!!raw-loader!./styles/index.css";
import cssButtonString from "!!raw-loader!./styles/button.css";
import cssModalString from "!!raw-loader!./styles/modalContent.css";
import cssDropdownString from "!!raw-loader!./styles/dropdown.css";
import cssInputString from "!!raw-loader!./styles/input.css";

const loadStyles = () => {
  if (!document.getElementById(`${pluginInfo.id}-styles`)) {
    const style = document.createElement("style");
    style.id = `${pluginInfo.id}-styles`;
    style.textContent =
      cssString +
      cssButtonString +
      cssModalString +
      cssDropdownString +
      cssInputString;
    document.head.appendChild(style);
  }
};

registerFn(pluginInfo, (handler, client, { toast, getLanguage }) => {
  loadStyles();
  handler.on("flotiq.plugins.manage::render", (data) =>
    handleManagePlugin(data, pluginInfo, client, toast, getLanguage)
  );
  handler.on("flotiq.form.field::config", (data) =>
    handleFormFieldConfig(data, pluginInfo)
  );
  handler.on("flotiq.plugin::migrate", handleMigrate);
});

const pluginManagePreviewRoot = document.getElementById("manage-preview-root");

if (pluginManagePreviewRoot) {
  loadStyles();
  loadManagePlugin(pluginManagePreviewRoot);
}
