import React, { ReactNode } from 'react';
import classNames from 'classnames';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  Icons,
  Button,
  ToolButton,
} from '../';
import { IconPresentationProvider } from '@ohif/ui-next';

import NavBar from '../NavBar';

// Todo: we should move this component to composition and remove props base

interface HeaderProps {
  children?: ReactNode;
  menuOptions: Array<{
    title: string;
    icon?: string;
    onClick: () => void;
  }>;
  isReturnEnabled?: boolean;
  onClickReturnButton?: () => void;
  isSticky?: boolean;
  WhiteLabeling?: {
    createLogoComponentFn?: (React: any, props: any) => ReactNode;
  };
  PatientInfo?: ReactNode;
  Secondary?: ReactNode;
  UndoRedo?: ReactNode;
}

function Header({
  children,
  menuOptions,
  isReturnEnabled = true,
  onClickReturnButton,
  isSticky = false,
  WhiteLabeling,
  PatientInfo,
  UndoRedo,
  Secondary,
  ...props
}: HeaderProps): ReactNode {
  const onClickReturn = () => {
    if (isReturnEnabled && onClickReturnButton) {
      onClickReturnButton();
    }
  };

  return (
    <IconPresentationProvider
      size="large"
      IconContainer={ToolButton}
    >
      <NavBar
        isSticky={isSticky}
        {...props}
      >
        <div className="relative h-[48px] items-center">
          <div className="absolute left-0 top-1/2 flex -translate-y-1/2 items-center">
            <div
              className={classNames(
                'mr-3 inline-flex items-center',
                isReturnEnabled && 'cursor-pointer'
              )}
              onClick={onClickReturn}
              data-cy="return-to-work-list"
            >
              {isReturnEnabled && <Icons.ArrowLeft className="text-primary ml-1 h-7 w-7" />}
              <div className="ml-1">
                {/* {WhiteLabeling?.createLogoComponentFn?.(React, props) || <Icons.OHIFLogo />} */}
                <img src="/assets/Logo_Yan.png" alt="Logo" style={{ height: 32 }} />
              </div>
            </div>
          </div>
          <div className="absolute top-1/2 left-[250px] h-8 -translate-y-1/2">{Secondary}</div>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
            <div className="flex items-center justify-center space-x-2">{children}</div>
          </div>
          <div className="absolute right-0 top-1/2 flex -translate-y-1/2 select-none items-center">
            {UndoRedo}
            <div className="border-primary-dark mx-1.5 h-[25px] border-r"></div>
            {PatientInfo}
            <div className="border-primary-dark mx-1.5 h-[25px] border-r"></div>
            {/* PACS yönlendirme butonu */}
            <Button
              variant="ghost"
              size="sm"
              className="ml-2 flex items-center"
              onClick={() => window.open('http://localhost:8080/dcm4chee-arc/ui2', '_blank')}
              title="PACS (dcm4chee)"
            >
              <Icons.Link className="mr-1 h-5 w-5" />
              PACS
            </Button>
          </div>
        </div>
      </NavBar>
    </IconPresentationProvider>
  );
}

export default Header;
