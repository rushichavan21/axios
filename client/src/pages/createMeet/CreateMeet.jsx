import "./create-meet.css";
import { useAuth0 } from "@auth0/auth0-react";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { BackgroundBeams } from "../../components/extraUicom/backgroundBeams";
import CreateButton from "@/components/createButton/CreateButton";
import CustomLoader from "@/components/customLoader/CustomLoader";
import Navbar from "@/components/navbar/Navbar";
import ReactDatePicker from "react-datepicker";
import JoinMeet from "@/components/JoinMeet";
import Util from "@/components/util/Util";

const CreateMeet = () => {
  const [isClientReady, setIsClientReady] = useState(false); // Track client readiness
  const [values, setValues] = useState({
    dateTime: new Date(),
    description: "",
  });
  const [callDetails, setCallDetails] = useState(null);
  const [modal, setModal] = useState("");
  const [isSchedule, setIsSchedule] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isLoading } = useAuth0();
  const client = useStreamVideoClient();

  const handleTextArea = (e) => {
    const { value, name } = e.target;
    setValues((prevValues) => {
      return {
        ...prevValues,
        [name]: value,
      };
    });
  };

  useEffect(() => {
    if (!isLoading && client) {
      setIsClientReady(true);
    }
  }, [client, isLoading]);

  const createMeeting = async () => {
    if (!isClientReady || !user) {
      console.error("Client not ready or user not authenticated");
      return;
    }

    try {
      if (!values.dateTime) {
        toast({ title: "Please select a date and time" });
        return;
      }

      const callId = crypto.randomUUID();
      const call = client.call("default", callId);

      if (!call) {
        throw new Error("Failed to create call");
      }

      const startsAt = values.dateTime.toISOString();
      const description = values.description || "Instant meeting";

      const isFutureMeeting = values.dateTime > new Date();

      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: { description },
        },
      });

      setCallDetails(call);

      if (isFutureMeeting) {
        setIsSchedule(true);
        toast({ title: "Meeting scheduled successfully!" });
      } else {
        toast({ title: "Meeting started" });
        navigate(`/meeting/${call.id}`);
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Failed to create meeting",
      });
    }
  };

  if (!isClientReady) return <CustomLoader />;

  return (
    <>
      <Navbar />
      <Util />
      <section className="hero | container">
        <div>
          <img className="hero__img" src="/meeting.png" alt="" />
        </div>
        <div className="hero__content-wrapper | container">
          <div className="hero__content">
            <button
              to="/schedule"
              className="hero__card"
              onClick={() => setModal("schedule")}
            >
              <figure>
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="hero__svg"
                >
                  <path d="M19 4h-1V3c0-.6-.4-1-1-1s-1 .4-1 1v1H8V3c0-.6-.4-1-1-1s-1 .4-1 1v1H5C3.3 4 2 5.3 2 7v1h20V7c0-1.7-1.3-3-3-3zM2 19c0 1.7 1.3 3 3 3h14c1.7 0 3-1.3 3-3v-9H2v9zm15-7c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1zm0 4c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1zm-5-4c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1zm0 4c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1zm-5-4c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1zm0 4c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1z" />
                </svg>
              </figure>
              <figcaption className="hero__caption">Schedule</figcaption>
            </button>
            <button className="hero__card" onClick={() => setModal("join")}>
              <figure>
                <svg
                  viewBox="0 0 1024 1024"
                  fill="currentColor"
                  className="hero__svg"
                >
                  <path d="M696 480H544V328c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v152H328c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h152v152c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V544h152c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8z" />
                  <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" />
                </svg>
              </figure>
              <figcaption className="hero__caption">Join</figcaption>
            </button>
            <CreateButton onClick={createMeeting} />
          </div>
          {modal === "join" ? <JoinMeet setModal={setModal} /> : null}
          {modal === "schedule" ? (
            <div className="hero__schedule-modal">
              {!isSchedule ? (
                <>
                  <div className="flex flex-col">
                    <label className="hero__label" htmlFor="description">
                      Description:
                    </label>
                    <textarea
                      name="description"
                      id="description"
                      value={values.description}
                      onChange={handleTextArea}
                      className="hero__textarea"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="hero__label" htmlFor="date">
                      Pick a date:
                    </label>
                    <ReactDatePicker
                      selected={values.dateTime}
                      onChange={(date) =>
                        setValues((prevValues) => ({
                          ...prevValues,
                          dateTime: date,
                        }))
                      }
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      timeCaption="time"
                      dateFormat="MMMM d, yyyy h:mm aa"
                      className="hero__date"
                    />
                  </div>
                  <Button
                    variant="secondary"
                    className="hero__btn"
                    onClick={() => {
                      setIsSchedule(true);
                      createMeeting();
                    }}
                  >
                    Schedule Meeting
                  </Button>
                  <Button
                    variant="secondary"
                    className="hero__close"
                    onClick={() => setModal("")}
                  >
                    Close
                  </Button>
                </>
              ) : (
                <div className="hero__meeting">
                  <p>Meeting link created!</p>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${
                          import.meta.VITE_BASE_URL || "localhost:5173"
                        }/meeting/${callDetails?.id}`
                      );
                      toast({ title: "Link Copied!" });
                    }}
                  >
                    Copy meeting Link
                  </Button>
                </div>
              )}
            </div>
          ) : null}
          <BackgroundBeams />
        </div>
      </section>
    </>
  );
};

export default CreateMeet;
