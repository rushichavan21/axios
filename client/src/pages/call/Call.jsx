import MeetingRoom from "@/components/meetingRoom/MeetingRoom";
import MeetingSetup from "@/components/meetingSetup/MeetingSetup";
import { useGetCallById } from "@/hooks/useGetCallByid";

import { useAuth0 } from "@auth0/auth0-react";
import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
import { useState } from "react";
import { useParams } from "react-router-dom";

const Call = () => {
  const { callId } = useParams();
  const { isLoading } = useAuth0();
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  const { call, isCallLoading } = useGetCallById(callId);

  if (isLoading || isCallLoading) return <div>Loading...</div>;

  return (
    <main className="h-screen w-full">
      <StreamCall call={call}>
        <StreamTheme>
          {!isSetupComplete ? (
            <MeetingSetup setIsSetupComplete={setIsSetupComplete} />
          ) : (
            <MeetingRoom />
          )}
        </StreamTheme>
      </StreamCall>
    </main>
  );
};

export default Call;