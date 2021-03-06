//  <PanelledCatalogue>
//  ===================

//  Catalogues are extremely straightforward, with no menus or other
//  clutter.

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import { defineMessages } from 'react-intl';

//  Component imports.
import {
  ConnectedCatalogue,
  RawPaneller,
} from 'themes/mastodon-go/components';

//  Other imports
import connect from 'themes/mastodon-go/util/connect';
import { moduleOnReady } from 'themes/mastodon-go/util/module';

//  * * * * * * *  //

//  Connecting
//  ----------

//  Variable declaration.
var PanelledCatalogue;

//  Building the paneller.
moduleOnReady(function () {
  PanelledCatalogue = connect(

    //  Component.
    RawPaneller,

    //  Store.
    null,

    //  Messages.
    defineMessages({
      title: {
        defaultMessage: 'Catalogue',
        description: 'Used as the fallback title for a catalogue',
        id: 'catalogue.title',
      },
      '❌': {
        defaultMessage: 'Close',
        description: 'Used in the paneller menu to return to Start',
        id: 'paneller.close',
      },
      '⬅': {
        defaultMessage: 'Back',
        description: 'Used in the paneller menu to close the current panel',
        id: 'paneller.back',
      },
    }),

    //  Handlers.
    null,

    //  Panelling.
    {
      backdrop: ConnectedCatalogue,
      className: 'MASTODON_GO--PANELLED--CATALOGUE',
      icon: ({ icon }) => icon,
      title: ({
        title,
        ℳ,
      }) => title || ℳ.title,
    }
  );
});

//  Exporting.
export { PanelledCatalogue as default };
