import React from 'react';
import { Button, Icons } from '@ohif/ui-next';
import { useSystem } from '@ohif/core';
import { toast } from '@ohif/ui-next';

export function StudyMeasurementsActions({ items, StudyInstanceUID, measurementFilter, actions }) {
  const { commandsManager } = useSystem();
  const disabled = !items?.length;

  if (disabled) {
    return null;
  }

  return (
    <div className="bg-background flex h-9 w-full items-center rounded pr-0.5">
      <div className="flex space-x-1">
        <Button
          size="sm"
          variant="ghost"
          className="pl-1.5"
          onClick={() => {
            commandsManager.runCommand('downloadCSVMeasurementsReport', {
              StudyInstanceUID,
              measurementFilter,
            });
          }}
        >
          <Icons.Download className="h-5 w-5" />
          <span className="pl-1">CSV</span>
        </Button>

        <Button
          size="sm"
          variant="ghost"
          className="pl-0.5"
          title="Tüm ölçümleri sunucuya gönder (yakında gerçek endpoint ile)"
          onClick={async e => {
            e.stopPropagation();
            try {
              const payload = { StudyInstanceUID, measurementFilter, items };
              // Basit, düzenlenebilir bir varsayılan uç nokta
              // Example endpoint for testing (echoes back the posted JSON)
              const endpoint =
                (window as any)?.OHIF_MEASUREMENTS_POST_URL || 'http://python-service:5001/json';

              const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
              });

              if (!response.ok) {
                throw new Error(`Request failed: ${response.status}`);
              }

              toast.success('Measurements successfully sent to the server!');
            } catch (err) {
              toast.error('An error occurred while sending to the server!');
            }
          }}
        >
          <Icons.Upload className="h-5 w-5" />
          <span className="pl-1">Send CSV</span>
        </Button>

        {/* <Button
          size="sm"
          variant="ghost"
          className="pl-0.5"
          onClick={e => {
            e.stopPropagation();
            if (actions?.createSR) {
              actions.createSR({ StudyInstanceUID, measurementFilter });
              return;
            }
            commandsManager.run('promptSaveReport', {
              StudyInstanceUID,
              measurementFilter,
            });
          }}
        >
          <Icons.Add />
          Create SR
        </Button> */}
        <Button
          size="sm"
          variant="ghost"
          className="pl-0.5"
          onClick={e => {
            e.stopPropagation();
            if (actions?.onDelete) {
              actions.onDelete();
              return;
            }
            commandsManager.runCommand('clearMeasurements', {
              measurementFilter,
            });
          }}
        >
          <Icons.Delete />
          Delete
        </Button>
      </div>
    </div>
  );
}

export default StudyMeasurementsActions;
