import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { useDrag } from 'react-dnd';
import { Icons } from '../Icons';
import { DisplaySetMessageListTooltip } from '../DisplaySetMessageListTooltip';
import { TooltipTrigger, TooltipContent, Tooltip } from '../Tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '../Dialog';

/**
 * Display a thumbnail for a display set.
 */
const Thumbnail = ({
  displaySetInstanceUID,
  className,
  imageSrc,
  imageAltText,
  description,
  seriesNumber,
  numInstances,
  loadingProgress,
  countIcon,
  messages,
  isActive,
  onClick,
  onDoubleClick,
  thumbnailType,
  modality,
  viewPreset = 'thumbnails',
  isHydratedForDerivedDisplaySet = false,
  isTracked = false,
  canReject = false,
  dragData = {},
  onReject = () => {},
  onClickUntrack = () => {},
  ThumbnailMenuItems = () => {},
}: withAppTypes): React.ReactNode => {
  // TODO: We should wrap our thumbnail to create a "DraggableThumbnail", as
  // this will still allow for "drag", even if there is no drop target for the
  // specified item.
  const [collectedProps, drag, dragPreview] = useDrag({
    type: 'displayset',
    item: { ...dragData },
    canDrag: function (monitor) {
      return Object.keys(dragData).length !== 0;
    },
  });

  const [lastTap, setLastTap] = useState(0);
  const [isModalOpen, setModalOpen] = useState(false);
  const [densityCorrect, setDensityCorrect] = useState('');
  const [densityValue, setDensityValue] = useState(''); // A, B, C, D
  const [biradsCorrect, setBiradsCorrect] = useState('');
  const [biradsValue, setBiradsValue] = useState(''); // 1, 2, 3
  const [annotationCorrect, setAnnotationCorrect] = useState('');
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');

  const handleTouchEnd = e => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;
    if (tapLength < 300 && tapLength > 0) {
      onDoubleClick(e);
    } else {
      onClick(e);
    }
    setLastTap(currentTime);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Burada verileri backend'e gönderebilirsin
    console.log({
      densityCorrect,
      densityValue,
      biradsCorrect,
      biradsValue,
      annotationCorrect,
      date,
      note,
      displaySetInstanceUID,
    });
    setModalOpen(false);
  };

  const renderThumbnailPreset = () => {
    return (
      <div
        className={classnames(
          'flex h-full w-full flex-col items-center justify-center gap-[2px] p-[4px]',
          isActive && 'bg-popover rounded'
        )}
      >
        <div className="h-[114px] w-[128px]">
          <div className="relative bg-black">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={imageAltText}
                className="h-[114px] w-[128px] rounded object-contain"
                crossOrigin="anonymous"
              />
            ) : (
              <div className="bg-background h-[114px] w-[128px] rounded"></div>
            )}

            {/* bottom left */}
            <div className="absolute bottom-0 left-0 flex h-[14px] items-center gap-[4px] rounded-tr pt-[10px] pb-[10px] pr-[6px] pl-[5px]">
              <div
                className={classnames(
                  'h-[10px] w-[10px] rounded-[2px]',
                  isActive || isHydratedForDerivedDisplaySet ? 'bg-highlight' : 'bg-primary/65',
                  loadingProgress && loadingProgress < 1 && 'bg-primary/25'
                )}
              ></div>
              <div className="text-[11px] font-semibold text-white">{modality}</div>
            </div>

            {/* top right */}
            <div className="absolute top-0 right-0 flex items-center gap-[4px]">
              <DisplaySetMessageListTooltip
                messages={messages}
                id={`display-set-tooltip-${displaySetInstanceUID}`}
              />
              {isTracked && (
                <Tooltip>
                  <TooltipTrigger>
                    <div className="group">
                      <Icons.StatusTracking className="text-primary-light h-[15px] w-[15px] group-hover:hidden" />
                      <Icons.Cancel
                        className="text-primary-light hidden h-[15px] w-[15px] group-hover:block"
                        onClick={onClickUntrack}
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <div className="flex flex-1 flex-row">
                      <div className="flex-2 flex items-center justify-center pr-4">
                        <Icons.InfoLink className="text-primary" />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <span>
                          <span className="text-white">
                            {isTracked ? 'Series is tracked' : 'Series is untracked'}
                          </span>
                        </span>
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
            {/* bottom right */}
            <div className="absolute bottom-0 right-0 flex items-center gap-[4px] p-[4px]">
              <ThumbnailMenuItems
                displaySetInstanceUID={displaySetInstanceUID}
                canReject={canReject}
                onReject={onReject}
              />
            </div>
          </div>
        </div>
        <div className="flex h-[52px] w-[128px] flex-col justify-start pt-px">
          <Tooltip>
            <TooltipContent>{description}</TooltipContent>
            <TooltipTrigger>
              <div className="min-h-[18px] w-[128px] overflow-hidden text-ellipsis whitespace-nowrap pb-0.5 pl-1 text-left text-[12px] font-normal leading-4 text-white">
                {description}
              </div>
            </TooltipTrigger>
          </Tooltip>
          <div className="flex h-[12px] items-center gap-[7px] overflow-hidden">
            <div className="text-muted-foreground pl-1 text-[11px]"> S:{seriesNumber}</div>
            <div className="text-muted-foreground text-[11px]">
              <div className="flex items-center gap-[4px]">
                {countIcon ? (
                  React.createElement(Icons[countIcon] || Icons.MissingIcon, { className: 'w-3' })
                ) : (
                  <Icons.InfoSeries className="w-3" />
                )}
                <div>{numInstances}</div>
              </div>
            </div>
          </div>
          {/* Bilgi Ekle butonu - instance kartının en altı */}
          {/*
          <button
            className="mt-2 w-full rounded bg-primary text-white py-1 text-xs hover:bg-primary-dark transition"
            onClick={e => {
              e.stopPropagation();
              setModalOpen(true);
            }}
          >
            Geri Bildirim Ekle
          </button>
          */}
          {/* Modal Form */}
          <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
            <DialogContent>
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <img src="/assets/logo.png" className="h-8" />
                <h2 className="text-xl font-extrabold" style={{ color: '#e53935' }}>RATIONE DIVIDE AI Geri Bildirim Formu</h2>
                <img src="/assets/Tübitak_Logo.png" className="h-16" />
              </div>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Soru 1 */}
                <label className="font-semibold text-white">
                  Kompozisyon (Breast Density) Bilgisi Doğru mu?
                  <div>
                    <input
                      type="radio"
                      name="densityCorrect"
                      value="yes"
                      checked={densityCorrect === 'yes'}
                      onChange={() => setDensityCorrect('yes')}
                    /> Evet
                    <input
                      type="radio"
                      name="densityCorrect"
                      value="no"
                      checked={densityCorrect === 'no'}
                      onChange={() => setDensityCorrect('no')}
                    /> Hayır
                  </div>
                  {densityCorrect === 'no' && (
                    <div className="flex flex-col gap-1 mt-2">
                      <span className="text-sm">Doğru Kompozisyon:</span>
                      <div className="flex gap-2">
                        {['A', 'B', 'C', 'D'].map(opt => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setDensityValue(opt)}
                            className={`px-4 py-1 rounded-full border transition font-semibold ${densityValue === opt ? 'bg-blue-800 text-white' : 'bg-white text-blue-800 border-blue-800'}`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </label>
                {/* Soru 2 */}
                <label className="font-semibold text-white">
                  BI-RADS Bilgisi Doğru mu?
                  <div>
                    <input
                      type="radio"
                      name="biradsCorrect"
                      value="yes"
                      checked={biradsCorrect === 'yes'}
                      onChange={() => setBiradsCorrect('yes')}
                    /> Evet
                    <input
                      type="radio"
                      name="biradsCorrect"
                      value="no"
                      checked={biradsCorrect === 'no'}
                      onChange={() => setBiradsCorrect('no')}
                    /> Hayır
                  </div>
                  {biradsCorrect === 'no' && (
                    <div className="flex flex-col gap-1 mt-2">
                      <span className="text-sm">Doğru BI-RADS:</span>
                      <div className="flex gap-2">
                        {[
                          { value: '1', label: 'BI-RADS 1' },
                          { value: '2', label: 'BI-RADS 2' },
                          { value: '3', label: 'BI-RADS 4-5' },
                        ].map(opt => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => setBiradsValue(opt.value)}
                            className={`px-4 py-1 rounded-full border transition font-semibold ${biradsValue === opt.value ? 'bg-blue-800 text-white' : 'bg-white text-blue-800 border-blue-800'}`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </label>
                {/* Soru 3 */}
                <label className="font-semibold text-white">
                  Anotasyon Bilgisi Doğru mu?
                  <div>
                    <input
                      type="radio"
                      name="annotationCorrect"
                      value="yes"
                      checked={annotationCorrect === 'yes'}
                      onChange={() => setAnnotationCorrect('yes')}
                    /> Evet
                    <input
                      type="radio"
                      name="annotationCorrect"
                      value="no"
                      checked={annotationCorrect === 'no'}
                      onChange={() => setAnnotationCorrect('no')}
                    /> Hayır
                  </div>
                  {annotationCorrect === 'no' && (
                    <div className="text-xs mt-1 text-white">
                      Anotasyonları gerçekleştirerek csv olarak gönderin
                    </div>
                  )}
                </label>
                {/* Footer */}
                <label className="font-semibold text-white">
                  İşlem Tarihi:
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="rounded border px-2 py-1"
                    style={{ color: 'black', background: 'white' }}
                  />
                </label>
                {/* Footer */}
                <div className="flex items-center font-semibold text-white mb-1">
                  <label htmlFor="note" className="mr-2 whitespace-nowrap">Not:</label>
                  <textarea
                    id="note"
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    className="rounded border px-2 py-1 flex-1"
                    style={{ color: 'black', background: 'white' }}
                    placeholder="Ekstra göndermek istediğiniz..."
                  />
                </div>
                <DialogFooter>
                  <button type="button" onClick={() => setModalOpen(false)} className="bg-blue-800 text-white px-4 py-2 rounded mr-2">İptal</button>
                  <button type="submit" className="bg-blue-800 text-white px-4 py-2 rounded">Kaydet</button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    );
  };

  const renderListPreset = () => {
    return (
      <div
        className={classnames(
          'flex h-full w-full items-center justify-between pr-[8px] pl-[8px] pt-[4px] pb-[4px]',
          isActive && 'bg-popover rounded'
        )}
      >
        <div className="relative flex h-[32px] w-full items-center gap-[8px] overflow-hidden">
          <div
            className={classnames(
              'h-[32px] w-[4px] min-w-[4px] rounded',
              isActive || isHydratedForDerivedDisplaySet ? 'bg-highlight' : 'bg-primary/65',
              loadingProgress && loadingProgress < 1 && 'bg-primary/25'
            )}
          ></div>
          <div className="flex h-full w-[calc(100%-12px)] flex-col justify-start">
            <div className="flex items-center gap-[7px]">
              <div className="text-[13px] font-semibold text-white">{modality}</div>
              <Tooltip>
                <TooltipContent>{description}</TooltipContent>
                <TooltipTrigger className="w-full overflow-hidden">
                  <div className="max-w-[160px] overflow-hidden overflow-ellipsis whitespace-nowrap text-left text-[13px] font-normal text-white">
                    {description}
                  </div>
                </TooltipTrigger>
              </Tooltip>
            </div>

            <div className="flex h-[12px] items-center gap-[7px] overflow-hidden">
              <div className="text-muted-foreground text-[12px]"> S:{seriesNumber}</div>
              <div className="text-muted-foreground text-[12px]">
                <div className="flex items-center gap-[4px]">
                  {' '}
                  {countIcon ? (
                    React.createElement(Icons[countIcon] || Icons.MissingIcon, { className: 'w-3' })
                  ) : (
                    <Icons.InfoSeries className="w-3" />
                  )}
                  <div>{numInstances}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex h-full items-center gap-[4px]">
          <DisplaySetMessageListTooltip
            messages={messages}
            id={`display-set-tooltip-${displaySetInstanceUID}`}
          />
          {isTracked && (
            <Tooltip>
              <TooltipTrigger>
                <div className="group">
                  <Icons.StatusTracking className="text-primary-light h-[20px] w-[15px] group-hover:hidden" />
                  <Icons.Cancel
                    className="text-primary-light hidden h-[15px] w-[15px] group-hover:block"
                    onClick={onClickUntrack}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">
                <div className="flex flex-1 flex-row">
                  <div className="flex-2 flex items-center justify-center pr-4">
                    <Icons.InfoLink className="text-primary" />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <span>
                      <span className="text-white">
                        {isTracked ? 'Series is tracked' : 'Series is untracked'}
                      </span>
                    </span>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          )}
          <ThumbnailMenuItems
            displaySetInstanceUID={displaySetInstanceUID}
            canReject={canReject}
            onReject={onReject}
          />
        </div>
      </div>
    );
  };

  return (
    <div
      className={classnames(
        className,
        'bg-muted hover:bg-primary/30 group flex cursor-pointer select-none flex-col rounded outline-none',
        viewPreset === 'thumbnails' && 'h-[170px] w-[135px]',
        viewPreset === 'list' && 'h-[40px] w-full'
      )}
      id={`thumbnail-${displaySetInstanceUID}`}
      data-cy={
        thumbnailType === 'thumbnailNoImage'
          ? 'study-browser-thumbnail-no-image'
          : 'study-browser-thumbnail'
      }
      data-series={seriesNumber}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onTouchEnd={handleTouchEnd}
      role="button"
    >
      <div
        ref={drag}
        className="h-full w-full"
      >
        {viewPreset === 'thumbnails' && renderThumbnailPreset()}
        {viewPreset === 'list' && renderListPreset()}
      </div>
    </div>
  );
};

Thumbnail.propTypes = {
  displaySetInstanceUID: PropTypes.string.isRequired,
  className: PropTypes.string,
  imageSrc: PropTypes.string,
  /**
   * Data the thumbnail should expose to a receiving drop target. Use a matching
   * `dragData.type` to identify which targets can receive this draggable item.
   * If this is not set, drag-n-drop will be disabled for this thumbnail.
   *
   * Ref: https://react-dnd.github.io/react-dnd/docs/api/use-drag#specification-object-members
   */
  dragData: PropTypes.shape({
    /** Must match the "type" a dropTarget expects */
    type: PropTypes.string.isRequired,
  }),
  imageAltText: PropTypes.string,
  description: PropTypes.string.isRequired,
  seriesNumber: PropTypes.any,
  numInstances: PropTypes.number.isRequired,
  loadingProgress: PropTypes.number,
  messages: PropTypes.object,
  isActive: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  onDoubleClick: PropTypes.func.isRequired,
  viewPreset: PropTypes.string,
  modality: PropTypes.string,
  isHydratedForDerivedDisplaySet: PropTypes.bool,
  isTracked: PropTypes.bool,
  onClickUntrack: PropTypes.func,
  countIcon: PropTypes.string,
  thumbnailType: PropTypes.oneOf(['thumbnail', 'thumbnailTracked', 'thumbnailNoImage']),
};

export { Thumbnail };
