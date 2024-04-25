import ReactDOM from "react-dom/client";
import {
  addElementToCache,
  getCachedElement,
  removeRoot,
} from "../common/plugin-helpers";
import i18n from "../i18n";
import ManageContent from "../components/ManageContent/ManageContent";

const updateManageModal = (root, data, client, toast) => {
  root.render(<ManageContent {...data} client={client} toast={toast} />);
};

const initManageModal = (div, data, client, toast) => {
  const root = ReactDOM.createRoot(div);
  updateManageModal(root, data, client, toast);
  return root;
};

export const handleManagePlugin = (
  data,
  pluginInfo,
  client,
  toast,
  getLanguage
) => {
  const language = getLanguage();
  if (language !== i18n.language) {
    i18n.changeLanguage(language);
  }

  const key = `${pluginInfo.id}-manage-render`;
  const cachedApp = getCachedElement(key);
  if (cachedApp) {
    updateManageModal(cachedApp.root, data, client, toast);
    return cachedApp.element;
  }

  const div = document.createElement("div");
  addElementToCache(div, initManageModal(div, data, client, toast), key);

  data.modalInstance.promise.then(() => removeRoot(key));
  return div;
};

export const loadManagePlugin = (pluginManagePreviewRoot) => {
  if (pluginManagePreviewRoot)
    initManageModal(
      pluginManagePreviewRoot,
      {
        plugin: {
          id: "id",
          name: "name",
          reload: () => {},
          modalInstance: { promise: () => {}, resolve: () => {} },
          contentTypes: [
            { name: "_media", label: "Media" },
            { name: "block", label: "Block" },
          ],
        },
      },
      {
        plugins_setting: { patch: () => Promise.resolve({}) },
      },
      { error: () => {} }
    );
};
