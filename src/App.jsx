import { useState, useEffect } from 'react';
import Uppy from '@uppy/core';
import Tus from '@uppy/tus';
import GoogleDrive from '@uppy/google-drive';
import {
  Dashboard,
  DashboardModal,
  DragDrop,
  ProgressBar,
  FileInput
} from '@uppy/react';

import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';
import '@uppy/drag-drop/dist/style.min.css';
import '@uppy/file-input/dist/style.css';
import '@uppy/progress-bar/dist/style.min.css';
import '@uppy/image-editor/dist/style.min.css';

const App = () => {
  const [showInlineDashboard, setShowInlineDashboard] = useState(false);
  const [open, setOpen] = useState(false);
  const [uppy, setUppy] = useState(null);
  const [uppy2, setUppy2] = useState(null);

  useEffect(() => {
    const uppyInstance = new Uppy({
      id: 'uppy1',
      autoProceed: true,
      debug: true
    })
      .use(Tus, { endpoint: 'https://tusd.tusdemo.net/files/' })
      .use(GoogleDrive, { companionUrl: 'https://companion.uppy.io' });

    setUppy(uppyInstance);

    const uppy2Instance = new Uppy({
      id: 'uppy2',
      autoProceed: false,
      debug: true
    });

    if (uppy2Instance) {
      uppy2Instance.use(Tus, { endpoint: 'https://tusd.tusdemo.net/files/' });
    }

    setUppy2(uppy2Instance);

    return () => {
      uppyInstance.close();
      if (uppy2Instance) {
        uppy2Instance.close();
      }
    };
  }, []);

  const handleModalClick = () => {
    setOpen(!open);
  };

  return (
    <div>
      <h1>React Examples</h1>

      <h2>Inline Dashboard</h2>
      <label>
        <input
          type='checkbox'
          checked={showInlineDashboard}
          onChange={(event) => {
            setShowInlineDashboard(event.target.checked);
          }}
        />
        Show Dashboard
      </label>
      {showInlineDashboard && (
        <Dashboard
          uppy={uppy}
          plugins={['GoogleDrive']}
          metaFields={[{ id: 'name', name: 'Name', placeholder: 'File name' }]}
        />
      )}

      <h2>Modal Dashboard</h2>
      <div>
        <button onClick={handleModalClick}>
          {open ? 'Close dashboard' : 'Open dashboard'}
        </button>
        {uppy2 && (
          <DashboardModal
            uppy={uppy2}
            open={open}
            onRequestClose={() => setOpen(false)}
          />
        )}
      </div>

      <h2>Drag Drop Area</h2>
      {uppy && (
        <DragDrop
          uppy={uppy}
          locale={{
            strings: {
              chooseFile: 'Boop a file',
              orDragDrop: 'or yoink it here'
            }
          }}
        />
      )}

      {uppy && (
        <>
          <h2>Progress Bar</h2>
          <ProgressBar uppy={uppy} />
          <h2>File Input</h2>
          <FileInput uppy={uppy} />
        </>
      )}
    </div>
  );
};

export default App;
