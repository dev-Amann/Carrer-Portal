import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../contexts/AuthContext';

/**
 * JitsiEmbed component - Embeds Jitsi Meet video conferencing using 8x8 External API
 * @param {string} roomId - Unique room identifier for the Jitsi meeting
 */
const JitsiEmbed = ({ roomId }) => {
  const { user } = useAuth();
  const jitsiContainerRef = useRef(null);
  const jitsiApiRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!roomId) return;

    // Jitsi 8x8 App ID / Magic Cookie
    const APP_ID = import.meta.env.VITE_JITSI_APP_ID || 'vpaas-magic-cookie-871735d1589a40d19237c18fe0c9f1f4';
    const SCRIPT_URL = `https://8x8.vc/${APP_ID}/external_api.js`;

    const loadJitsiScript = () => {
      if (document.getElementById('jitsi-meet-external-api-script')) {
        initializeJitsi(APP_ID);
        return;
      }

      const script = document.createElement('script');
      script.src = SCRIPT_URL;
      script.async = true;
      script.id = 'jitsi-meet-external-api-script';
      script.onload = () => initializeJitsi(APP_ID);
      document.body.appendChild(script);
    };

    const initializeJitsi = (appId) => {
      if (!window.JitsiMeetExternalAPI) return;

      setLoading(false);

      const options = {
        roomName: `${appId}/${roomId}`,
        width: '100%',
        height: '100%',
        parentNode: jitsiContainerRef.current,
        userInfo: {
          displayName: user?.name || 'Guest',
          email: user?.email
        },
        configOverwrite: {
          startWithAudioMuted: false,
          startWithVideoMuted: false,
        },
        interfaceConfigOverwrite: {
          TOOLBAR_BUTTONS: [
            'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
            'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
            'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
            'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
            'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone',
            'security'
          ],
        },
      };

      jitsiApiRef.current = new window.JitsiMeetExternalAPI("8x8.vc", options);

      // Add event listeners if needed
      jitsiApiRef.current.addEventListeners({
        videoConferenceLeft: () => {
          // Handle call end - maybe redirect or close
          console.log("Call Ended");
        },
      });
    };

    loadJitsiScript();

    return () => {
      if (jitsiApiRef.current) {
        jitsiApiRef.current.dispose();
      }
    };
  }, [roomId, user]);

  if (!roomId) {
    return (
      <div className="flex items-center justify-center p-8 bg-gray-800 rounded-lg">
        <p className="text-gray-400">No room ID provided</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[500px] relative bg-gray-900 rounded-lg overflow-hidden">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-10 text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      )}
      <div ref={jitsiContainerRef} className="w-full h-full" />
    </div>
  );
};

JitsiEmbed.propTypes = {
  roomId: PropTypes.string.isRequired,
};

export default JitsiEmbed;
