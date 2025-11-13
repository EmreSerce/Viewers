import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { ThumbnailList } from '../ThumbnailList';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../Accordion';
import { Tooltip, TooltipContent, TooltipTrigger } from '../Tooltip';
import { Dialog, DialogContent } from '../Dialog';
import { useState } from 'react';
// import { toast } from '@ohif/ui-next';

const StudyItem = ({
  date,
  description,
  numInstances,
  modalities,
  isActive,
  onClick,
  isExpanded,
  displaySets,
  activeDisplaySetInstanceUIDs,
  onClickThumbnail,
  onDoubleClickThumbnail,
  onClickUntrack,
  viewPreset = 'thumbnails',
  ThumbnailMenuItems,
  StudyMenuItems,
  StudyInstanceUID,
}: withAppTypes) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [composition, setComposition] = useState(''); // A, B, C, D
  const [biradsSol, setBiradsSol] = useState(''); // BIRADS 0, BIRADS 1, BIRADS 3, BIRADS 2, BIRADS 45
  const [biradsSag, setBiradsSag] = useState(''); // BIRADS 0, BIRADS 1, BIRADS 2, BIRADS 3, BIRADS 45
  const [detectionProcess, setDetectionProcess] = useState(''); // faydalı, faydasız
  const [note, setNote] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Burada verileri backend'e gönderebilirsin
    console.log({
      composition,
      biradsSol,
      biradsSag,
      detectionProcess,
      note,
      StudyInstanceUID,
    });
    // toast.success('Başarıyla Form gönderildi');
    setModalOpen(false);
  };

  // Validasyon
  const isFormValid =
    composition &&
    biradsSol &&
    biradsSag &&
    detectionProcess;

  return (
    <Accordion
      type="single"
      collapsible
      onClick={onClick}
      onKeyDown={() => {}}
      role="button"
      tabIndex={0}
      defaultValue={isActive ? 'study-item' : undefined}
    >
      <AccordionItem value="study-item">
        <AccordionTrigger className={classnames('hover:bg-accent bg-popover group w-full rounded')}>
          <div className="flex h-[40px] w-full flex-row overflow-hidden">
            <div className="flex w-full flex-row items-center justify-between">
              <div className="flex min-w-0 flex-col items-start text-[13px]">
                <Tooltip>
                  <TooltipContent>{date}</TooltipContent>
                  <TooltipTrigger
                    className="w-full"
                    asChild
                  >
                    <div className="h-[18px] w-full max-w-[160px] overflow-hidden truncate whitespace-nowrap text-left text-white">
                      {date}
                    </div>
                  </TooltipTrigger>
                </Tooltip>
                <Tooltip>
                  <TooltipContent>{description}</TooltipContent>
                  <TooltipTrigger
                    className="w-full"
                    asChild
                  >
                    <div className="text-muted-foreground h-[18px] w-full overflow-hidden truncate whitespace-nowrap text-left">
                      {description}
                    </div>
                  </TooltipTrigger>
                </Tooltip>
              </div>
              <div className="text-muted-foreground flex flex-col items-end pl-[10px] text-[12px]">
                <div className="max-w-[150px] overflow-hidden text-ellipsis">{modalities}</div>
                <div>{numInstances}</div>
              </div>
              {StudyMenuItems && (
                <div className="ml-2 flex items-center">
                  <StudyMenuItems StudyInstanceUID={StudyInstanceUID} />
                </div>
              )}
              {/* Study düzeyinde Geri Bildirim Ekle butonu */}
              <button
                className="ml-4 rounded bg-primary text-white py-1 px-2 text-xs hover:bg-primary-dark transition"
                onClick={e => {
                  e.stopPropagation();
                  setModalOpen(true);
                }}
              >
                Geri Bildirim Ekle
              </button>
              <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
                <DialogContent onClick={e => e.stopPropagation()}>
                  {/* Header */}
                  <div className="flex gap-5 items-center c mb-4">
                    <img src="/assets/logo.png" className="h-8" />
                    <h2 className="text-xl font-extrabold" style={{ color: '#e53935' }}>RATIONE DIVIDE AI Geri Bildirim Formu</h2>
                  </div>
                  <form
                    onClick={e => e.stopPropagation()}
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4"
                  >
                    {/* Kompozisyon Bilgisi */}
                    <div className="flex flex-col gap-2">
                      <label className="font-semibold text-white text-xl">Kompozisyon Bilgisi:</label>
                      <div className="flex gap-4">
                        {['A', 'B', 'C', 'D'].map(val => (
                          <label key={val} className="text-white flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="composition"
                              value={val}
                              checked={composition === val}
                              onChange={() => setComposition(val)}
                              className="cursor-pointer"
                            />
                            <span>{val}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* BIRADS Bilgisi */}
                    <div className="flex flex-col gap-3">
                      <label className="font-semibold text-white text-xl">BIRADS Bilgisi:</label>

                      {/* Sol */}
                      <div className="flex flex-col gap-2 pl-4">
                        <label className="font-semibold text-white text-lg">Sol:</label>
                        <div className="flex gap-4">
                          {['B0', 'B1', 'B2', 'B3', 'B4', 'B5'].map(val => (
                            <label key={val} className="text-white flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="biradsSol"
                                value={val}
                                checked={biradsSol === val}
                                onChange={() => setBiradsSol(val)}
                                className="cursor-pointer"
                              />
                              <span>{val}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Sağ */}
                      <div className="flex flex-col gap-2 pl-4">
                        <label className="font-semibold text-white text-lg">Sağ:</label>
                        <div className="flex gap-4">
                          {['B0', 'B1', 'B2', 'B3', 'B4', 'B5'].map(val => (
                            <label key={val} className="text-white flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="biradsSag"
                                value={val}
                                checked={biradsSag === val}
                                onChange={() => setBiradsSag(val)}
                                className="cursor-pointer"
                              />
                              <span>{val}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Tespit İşlem Bilgisi */}
                    <div className="flex flex-col gap-2">
                      <label className="font-semibold text-white text-xl">Tespit İşlemi Fayda Sağladı mı?</label>
                      <div className="flex gap-4">
                        {['Evet', 'Hayır'].map(val => (
                          <label key={val} className="text-white flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="detectionProcess"
                              value={val}
                              checked={detectionProcess === val}
                              onChange={() => setDetectionProcess(val)}
                              className="cursor-pointer"
                            />
                            <span>{val}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Text (Not) */}
                    <label className="font-semibold text-white w-full flex flex-col">
                      <span className="mb-1 text-xl">Ek Not (Opsiyonel):</span>
                      <textarea
                        className="rounded p-2 bg-white text-black w-full"
                        rows={3}
                        value={note}
                        onChange={e => setNote(e.target.value)}
                        placeholder="Tespit işlemi hakkında detaylı bilgi veriniz..."
                      />
                    </label>

                    <button
                      type="submit"
                      className={`rounded bg-primary text-white py-2 px-4 mt-2 ${!isFormValid ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={!isFormValid}
                    >
                      Gönder
                    </button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent
          onClick={event => {
            event.stopPropagation();
          }}
        >
          {isExpanded && displaySets && (
            <ThumbnailList
              thumbnails={displaySets}
              activeDisplaySetInstanceUIDs={activeDisplaySetInstanceUIDs}
              onThumbnailClick={onClickThumbnail}
              onThumbnailDoubleClick={onDoubleClickThumbnail}
              onClickUntrack={onClickUntrack}
              viewPreset={viewPreset}
              ThumbnailMenuItems={ThumbnailMenuItems}
            />
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

StudyItem.propTypes = {
  date: PropTypes.string.isRequired,
  description: PropTypes.string,
  modalities: PropTypes.string.isRequired,
  numInstances: PropTypes.number.isRequired,
  isActive: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  isExpanded: PropTypes.bool,
  displaySets: PropTypes.array,
  activeDisplaySetInstanceUIDs: PropTypes.array,
  onClickThumbnail: PropTypes.func,
  onDoubleClickThumbnail: PropTypes.func,
  onClickUntrack: PropTypes.func,
  viewPreset: PropTypes.string,
  StudyMenuItems: PropTypes.func,
  StudyInstanceUID: PropTypes.string,
};

export { StudyItem };
