import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { ErrorBoundary, LoadingIndicatorProgress } from '@ohif/ui';
import { ServicesManager, HangingProtocolService, CommandsManager } from '@ohif/core';
import { useAppConfig } from '@state';
import ViewerHeader from './ViewerHeader';
import SidePanelWithServices from '../Components/SidePanelWithServices';
import { useWindowSize } from '../utils/useWindowSize';
import Toolbar from '../Toolbar/Toolbar';

function ViewerLayout({
  // From Extension Module Params
  extensionManager,
  servicesManager,
  hotkeysManager,
  commandsManager,
  // From Modes
  viewports,
  ViewportGridComp,
  leftPanels = [],
  rightPanels = [],
  leftPanelDefaultClosed = true,
  rightPanelDefaultClosed = false,
}): React.JSX.Element {
  const [appConfig] = useAppConfig();
  const windowSize = useWindowSize();

  const { hangingProtocolService } = servicesManager.services;
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(appConfig.showLoadingIndicator);
  const [showAdditionToolbar] = useState(appConfig.showAdditionToolbar);

  /**
   * Set body classes (tailwindcss) that don't allow vertical
   * or horizontal overflow (no scrolling). Also guarantee window
   * is sized to our viewport.
   */
  useEffect(() => {
    document.body.classList.add('bg-black');
    document.body.classList.add('overflow-hidden');
    return () => {
      document.body.classList.remove('bg-black');
      document.body.classList.remove('overflow-hidden');
    };
  }, []);

  const [defaultClosed, setClosed] = useState(leftPanelDefaultClosed);
  const [useBottomPanel, setBottomPanel] = useState(false);
  useEffect(() => {
    switch (appConfig.panelMode) {
      case 'left':
        setBottomPanel(false);
        break;
      case 'bottom':
        setBottomPanel(true);
        break;
      case 'auto':
      default:
        if (windowSize.height > 0.75 * windowSize.width) {
          setBottomPanel(true);
        } else {
          setBottomPanel(false);
          setClosed(windowSize.width < 1024);
        }
    }
  }, [windowSize]);

  const getComponent = id => {
    const entry = extensionManager.getModuleEntry(id);

    if (!entry) {
      throw new Error(
        `${id} is not valid for an extension module. Please verify your configuration or ensure that the extension is properly registered. It's also possible that your mode is utilizing a module from an extension that hasn't been included in its dependencies (add the extension to the "extensionDependencies" array in your mode's index.js file)`
      );
    }

    let content;
    if (entry && entry.component) {
      content = entry.component;
    } else {
      throw new Error(
        `No component found from extension ${id}. Check the reference string to the extension in your Mode configuration`
      );
    }

    return { entry, content };
  };

  const getPanelData = id => {
    const { content, entry } = getComponent(id);

    return {
      id: entry.id,
      iconName: entry.iconName,
      iconLabel: entry.iconLabel,
      label: entry.label,
      name: entry.name,
      content,
    };
  };

  useEffect(() => {
    const { unsubscribe } = hangingProtocolService.subscribe(
      HangingProtocolService.EVENTS.PROTOCOL_CHANGED,

      // Todo: right now to set the loading indicator to false, we need to wait for the
      // hangingProtocolService to finish applying the viewport matching to each viewport,
      // however, this might not be the only approach to set the loading indicator to false. we need to explore this further.
      () => {
        setShowLoadingIndicator(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [hangingProtocolService]);

  const getViewportComponentData = viewportComponent => {
    const { entry } = getComponent(viewportComponent.namespace);

    return {
      component: entry.component,
      displaySetsToDisplay: viewportComponent.displaySetsToDisplay,
    };
  };

  const leftPanelComponents = leftPanels.map(getPanelData);
  const rightPanelComponents = []; /*rightPanels.map(getPanelData)*/
  const viewportComponents = viewports.map(getViewportComponentData);

  return (
    <div
      className="flex flex-col"
      style={{ height: `${windowSize.height}px` }}
    >
      <ViewerHeader
        hotkeysManager={hotkeysManager}
        extensionManager={extensionManager}
        servicesManager={servicesManager}
      />
      <div
        className="relative flex w-full flex-auto flex-row flex-nowrap items-stretch overflow-hidden bg-black"
        // style={{ height: 'calc(100vh - 52px' }}
      >
        <React.Fragment>
          {showLoadingIndicator && <LoadingIndicatorProgress className="h-full w-full bg-black" />}
          {/* LEFT SIDEPANELS */}
          {!useBottomPanel && leftPanelComponents.length ? (
            <ErrorBoundary context="Left Panel">
              <SidePanelWithServices
                side="left"
                activeTabIndex={defaultClosed ? null : 0}
                tabs={leftPanelComponents}
                servicesManager={servicesManager}
              />
            </ErrorBoundary>
          ) : null}
          {/* TOOLBAR + GRID */}
          <div className="flex h-full flex-1 flex-col">
            <div className="relative flex h-full flex-1 items-center justify-center overflow-hidden bg-black">
              <ErrorBoundary context="Grid">
                <ViewportGridComp
                  servicesManager={servicesManager}
                  viewportComponents={viewportComponents}
                  commandsManager={commandsManager}
                />
                {showAdditionToolbar ? (
                  <div
                    id="addition-toolbar"
                    className="absolute flex"
                    style={{ bottom: '12px', right: '12px', display: 'none' }}
                  >
                    <Toolbar
                      servicesManager={servicesManager}
                      type="addition"
                    />
                  </div>
                ) : null}
              </ErrorBoundary>
            </div>
          </div>
          {rightPanelComponents.length ? (
            <ErrorBoundary context="Right Panel">
              <SidePanelWithServices
                side="right"
                activeTabIndex={rightPanelDefaultClosed ? null : 0}
                tabs={rightPanelComponents}
                servicesManager={servicesManager}
              />
            </ErrorBoundary>
          ) : null}
        </React.Fragment>
      </div>
      <React.Fragment>
        {useBottomPanel && leftPanelComponents.length ? (
          <ErrorBoundary context="bottom Panel">
            <SidePanelWithServices
              side="bottom"
              activeTabIndex={0}
              tabs={leftPanelComponents}
              servicesManager={servicesManager}
            />
          </ErrorBoundary>
        ) : null}
      </React.Fragment>
    </div>
  );
}

ViewerLayout.propTypes = {
  // From extension module params
  extensionManager: PropTypes.shape({
    getModuleEntry: PropTypes.func.isRequired,
  }).isRequired,
  commandsManager: PropTypes.instanceOf(CommandsManager),
  servicesManager: PropTypes.instanceOf(ServicesManager),
  // From modes
  leftPanels: PropTypes.array,
  rightPanels: PropTypes.array,
  leftPanelDefaultClosed: PropTypes.bool.isRequired,
  rightPanelDefaultClosed: PropTypes.bool.isRequired,
  /** Responsible for rendering our grid of viewports; provided by consuming application */
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
  viewports: PropTypes.array,
};

export default ViewerLayout;
