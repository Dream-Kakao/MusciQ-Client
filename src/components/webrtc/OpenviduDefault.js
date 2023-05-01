import React, { Component } from "react";
import { OpenVidu } from "openvidu-browser";
import UserVideoComponent from "./UserVideoComponent";
import axios from "axios";
import Youtube from "react-youtube";
import styled from "styled-components";
import { MultiSelect } from "react-multi-select-component";
import { Box } from "@material-ui/core";

import "./Openvidu.css";

import GameResultDialog from "./GameResultDialog";
import CountdownSound1 from "../../assets/music/CountdownSound1.mp3";

const APPLICATION_SERVER_URL =
  // process.env.NODE_ENV === "production" ? "" : "http://localhost:8080/api/v1/";
  process.env.NODE_ENV === "production" ? "" : "https://drkko.site/api/v1/";

// !logic
class OpenviduDefault extends Component {
  // !초기세팅
  constructor(props) {
    super(props);

    // These properties are in the state's component in order to re-render the HTML whenever their values change
    this.state = {
      mySessionId: sessionStorage.getItem("sessionID") || "Session0",
      myUserName:
      sessionStorage.getItem("UserNickName") ||
        "참가자" + Math.floor(Math.random() * 100),
      session: undefined,
      mainStreamManager: undefined, // Main video of the page. Will be the 'publisher' or one of the 'subscribers'
      publisher: undefined,
      subscribers: [],
      // music
      musics: [], // axios로 노래관련된 것들을 받아올 배열
      musicSelected: [], // MultiSet에서 고른 노래들을 담을 배열
      // youtube
      player: null,
      playlist: [], // 선택한 음악(musicSelected)의 videoId만 가져와서 넣어놓은 배열
      //musicIndex: 0, // 지금 플레이할 음악의 인덱스
      // game
      synthesis: null, // 음성 합성 API
      winnerName: null,
      answer: false, // 정답 버튼 활성화 유무
      gameStart: false, // 게임 시작 버튼 활성화 유무
    };

    this.joinSession = this.joinSession.bind(this);
    this.leaveSession = this.leaveSession.bind(this);
    this.switchCamera = this.switchCamera.bind(this);
    this.handleChangeSessionId = this.handleChangeSessionId.bind(this);
    this.handleChangeUserName = this.handleChangeUserName.bind(this);
    this.handleMainVideoStream = this.handleMainVideoStream.bind(this);
    this.onbeforeunload = this.onbeforeunload.bind(this);
    this.deleteRoom = this.deleteRoom.bind(this);
    // music
    this.handleMusicSelected = this.handleMusicSelected.bind(this);
    // youtube
    this.handleReadyMusic = this.handleReadyMusic.bind(this); // 플레이어 준비
    this.handlePlayMusic = this.handlePlayMusic.bind(this); // 음악 재생
    // game
    this.playGame = this.playGame.bind(this);
    this.oneRound = this.oneRound.bind(this);
  }

  // !method
  componentDidMount() {
    window.addEventListener("beforeunload", this.onbeforeunload);

    // 방생성 시 노래목록 출력 위해 모든 노래 불러오기
    axios({
      method: "get",
      url: APPLICATION_SERVER_URL + "musics/all",
      withCredentials: true,
    })
      .then((response) => {
        this.setState({ musics: response.data });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  componentWillUnmount() {
    window.removeEventListener("beforeunload", this.onbeforeunload);
  }

  onbeforeunload(event) {
    this.leaveSession();
  }

  handleChangeSessionId(e) {
    this.setState({
      mySessionId: e.target.value,
    });
  }

  handleChangeUserName(e) {
    this.setState({
      myUserName: e.target.value,
    });
  }

  handleMainVideoStream(stream) {
    if (this.state.mainStreamManager !== stream) {
      this.setState({
        mainStreamManager: stream,
      });
    }
  }

  deleteSubscriber(streamManager) {
    let subscribers = this.state.subscribers;
    let index = subscribers.indexOf(streamManager, 0);
    if (index > -1) {
      subscribers.splice(index, 1);
      this.setState({
        subscribers: subscribers,
      });
    }
  }

  async deleteRoom(sessionId) {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL_V1}rooms/delete/${sessionId}`,
        { withCredentials: true }
      );
    } catch (error) {
      console.log(error);
    }
  }

  // !Openvidu 관련 메서드
  joinSession() {
    // --- 1) Get an OpenVidu object ---

    this.OV = new OpenVidu();

    // --- 2) Init a session ---

    this.setState(
      {
        session: this.OV.initSession(),
      },
      () => {
        var mySession = this.state.session;

        // --- 3) Specify the actions when events take place in the session ---

        // On every new Stream received...
        mySession.on("streamCreated", (event) => {
          // Subscribe to the Stream to receive it. Second parameter is undefined
          // so OpenVidu doesn't create an HTML video by its own
          var subscriber = mySession.subscribe(event.stream, undefined);
          var subscribers = this.state.subscribers;
          subscribers.push(subscriber);

          // Update the state with the new subscribers
          this.setState({
            subscribers: subscribers,
          });
        });

        // On every Stream destroyed...
        mySession.on("streamDestroyed", (event) => {
          // Remove the stream from 'subscribers' array
          this.deleteSubscriber(event.stream.streamManager);
        });

        // On every asynchronous exception...
        mySession.on("exception", (exception) => {
          console.warn(exception);
        });

        // --- 4) Connect to the session with a valid user token ---

        // Get a token from the OpenVidu deployment
        this.getToken().then((token) => {
          // First param is the token got from the OpenVidu deployment. Second param can be retrieved by every user on event
          // 'streamCreated' (property Stream.connection.data), and will be appended to DOM as the user's nickname
          mySession
            .connect(token, { clientData: this.state.myUserName })
            .then(async () => {
              // --- 5) Get your own camera stream ---

              // Init a publisher passing undefined as targetElement (we don't want OpenVidu to insert a video
              // element: we will manage it on our own) and with the desired properties
              let publisher = await this.OV.initPublisherAsync(undefined, {
                audioSource: undefined, // The source of audio. If undefined default microphone
                videoSource: undefined, // The source of video. If undefined default webcam
                publishAudio: true, // Whether you want to start publishing with your audio unmuted or not
                publishVideo: true, // Whether you want to start publishing with your video enabled or not
                resolution: "640x480", // The resolution of your video
                frameRate: 30, // The frame rate of your video
                insertMode: "APPEND", // How the video is inserted in the target element 'video-container'
                mirror: false, // Whether to mirror your local video or not
              });

              // --- 6) Publish your stream ---

              mySession.publish(publisher);

              // Obtain the current video device in use
              var devices = await this.OV.getDevices();
              var videoDevices = devices.filter(
                (device) => device.kind === "videoinput"
              );
              var currentVideoDeviceId = publisher.stream
                .getMediaStream()
                .getVideoTracks()[0]
                .getSettings().deviceId;
              var currentVideoDevice = videoDevices.find(
                (device) => device.deviceId === currentVideoDeviceId
              );

              // Set the main video in the page to display our webcam and store our Publisher
              this.setState({
                currentVideoDevice: currentVideoDevice,
                mainStreamManager: publisher,
                publisher: publisher,
              });
            })
            .catch((error) => {
              console.log(
                "There was an error connecting to the session:",
                error.code,
                error.message
              );
            });
        });
      }
    );
  }

  leaveSession() {
    // --- 7) Leave the session by calling 'disconnect' method over the Session object ---

    const mySession = this.state.session;
    const subscribers = this.state.subscribers;
    const mySessionId = sessionStorage.getItem("sessionID");
    const synthesis = this.state.synthesis;

    // 가사 정지
    if (synthesis != null) {
      synthesis.cancel();
    }

    if (mySession) {
      mySession.disconnect();
    }

    // 남은 인원이 호스트 제외하고 없으면 DB에서 방 데이터 삭제
    if (subscribers.length == 0) {
      this.deleteRoom(mySessionId);
    }

    // Empty all properties...
    this.OV = null;
    this.setState({
      session: undefined,
      subscribers: [],
      mySessionId: "Session0",
      myUserName: sessionStorage.getItem("UserNickName"),
      mainStreamManager: undefined,
      publisher: undefined,
    });

    sessionStorage.removeItem("sessionID");
    window.location.replace("roomlist");
  }

  async switchCamera() {
    try {
      const devices = await this.OV.getDevices();
      var videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );

      if (videoDevices && videoDevices.length > 1) {
        var newVideoDevice = videoDevices.filter(
          (device) => device.deviceId !== this.state.currentVideoDevice.deviceId
        );

        if (newVideoDevice.length > 0) {
          // Creating a new publisher with specific videoSource
          // In mobile devices the default and first camera is the front one
          var newPublisher = this.OV.initPublisher(undefined, {
            videoSource: newVideoDevice[0].deviceId,
            publishAudio: true,
            publishVideo: true,
            mirror: true,
          });

          //newPublisher.once("accessAllowed", () => {
          await this.state.session.unpublish(this.state.mainStreamManager);

          await this.state.session.publish(newPublisher);
          this.setState({
            currentVideoDevice: newVideoDevice[0],
            mainStreamManager: newPublisher,
            publisher: newPublisher,
          });
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  // 게임 시작 메서드
  async playGame(selectedSongs) {
    // 게임 시작하면 정답버튼, 게임시작버튼 비활성화
    this.state.answer = false;
    this.state.gameStart = false;

    for (const song of selectedSongs) {
      const value = song.value;
      const musicId = JSON.parse(value).musicId;

      const audio = new Audio(CountdownSound1);
      audio.play();
      // 카운트다운 소리 끝날때까지 기다림
      await new Promise((resolve) => {
        audio.addEventListener("ended", async () => {
          await this.oneRound(musicId);
          resolve();
        });
      });
    }
  }

  // 한 라운드 끝날때마다 이 함수 호출
  async oneRound(musicId) {
    await axios
      .get(`${process.env.REACT_APP_API_URL_V1}games/lyrics`, {
        params: {
          id: musicId,
        },
        withCredentials: true,
      })
      .then((res) => {
        const data = res.data;

        // 가사 얻어오기
        const lyric = data[musicId];

        // 음성 합성 API
        const synthesis = window.speechSynthesis;
        this.setState({ synthesis: synthesis });

        // 음성 출력 설정
        var utterance = new SpeechSynthesisUtterance();
        utterance.text = lyric;
        utterance.lang = "ko-KR";
        /* utterance.voice = synthesis.getVoices(); 목소리 설정 */
        /* utterance.pitch = 1; 음성 높낮이 설정 (0~2) */
        utterance.rate = 1; /* 음성 속도 설정 (0.1~10) */

        // 음성 출력
        // speak() 메서드는 비동기적으로 작동하므로 다음 로직이 동시에 실행되는 것을 막기 위해 promise 사용
        return new Promise((resolve) => {
          synthesis.speak(utterance);

          utterance.onend = () => {
            resolve();
          };
        });
      })
      .catch((err) => {
        // api 요청 실패
        console.error(err);
      });
  }

  // 고른 노래들로부터 유튜브노래 재생하기 위한 videoId를 추출하는 메서드
  handleMusicSelected(musicSelected) {
    // 하나만 선택되기 위해
    if (musicSelected.length > 1) {
      // 마지막으로 고른 음악이 musicSelected에 들어간다.
      this.setState({
        musicSelected: musicSelected.slice(musicSelected.length - 1),
      });
    } else if (musicSelected.length == 0) {
      return;
    } else {
      this.setState({ musicSelected: musicSelected });
    }

    // musicSelected 배열의 마지막 원소
    const music = musicSelected[musicSelected.length - 1];
    const playlist = JSON.parse(music.value).videoId;

    this.setState({
      gameStart: true,
      playlist: playlist,
    });
  }

  // 플레이어를 지금 상태대로 셋팅
  handleReadyMusic(event) {
    this.setState({
      player: event.target,
    });
  }

  // 플레이어를 가져와서 음악을 재생
  handlePlayMusic(event) {
    const player = this.state.player;
    const musicSelected = this.state.musicSelected;
    const synthesis = this.state.synthesis;

    // 선택된 노래가 없는 경우 alert
    if (musicSelected.length === 0) {
      alert("선택된 노래가 없어요🙈");
      return;
    }

    // 가사 정지
    synthesis.cancel();

    player.playVideo();

    // 게임시작버튼 활성화
    this.setState({ gameStart: true });

    //  musicIndex를 1 증가 시킴(다음 노래 준비)
    // this.setState((prev) => ({
    //   musicIndex: (prev.musicIndex + 1) % musicSelected.length,
    // }));
  }

  // 정답자 클릭했을때 정답자이름 setState
  isWinner(stream, i) {
    const subscribers = this.state.subscribers;
    const winnerName = subscribers[i].stream.connection.data;

    this.setState({ winnerName: JSON.parse(winnerName).clientData }); // 정답자 이름

    // 게임을 시작하지도 않았는데 정답자를 클릭하지 못하게 하는 조건문
    if (this.state.synthesis != null) {
      this.setState({ answer: true }); // 정답버튼 활성화
    }
  }

  render() {
    const winnerName = this.props;
    const mySessionId = this.state.mySessionId;
    const myUserName = this.state.myUserName;
    const playlist = this.state.playlist;
    //const musicIndex = this.state.musicIndex;

    // MultiSelect에 들어갈 옵션
    // label은 말그대로 라벨, 보여지는 모습
    // value는 label에 해당하는 값, "{"musicId": 1, "videoId": "8DKRJ84JD"}" 처럼 문자열로 들어감
    const options = this.state.musics.map((music) => ({
      label: `${music.musicTitle} - ${music.singer}`,
      value: JSON.stringify({
        musicId: music.musicId,
        videoId: music.videoId,
      }),
    }));

    console.log(myUserName);
    console.log(sessionStorage.getItem("myUserName"));

    return (
      // join session 하는 페이지. 추 후에 지워야 됨.
      // todo container로 잡혀있기 때문에 자동으로 width가 85% 로 줄어들게 됨. 추 후에 이 부분만 줄이던가 해야될듯?
      <div className="container">
        {this.state.session === undefined ? this.joinSession() : null}

        {/* 세션을 보여주는 페이지
          this.state.session이 없다면 페이지를 보여주면 안된다. */}
        {this.state.session !== undefined ? (
          <div id="session">
            {/* body 내 헤더 부분. 고정 쌉가능 */}
            <div id="session-header">
              <h1 id="session-title">{mySessionId}</h1>
              <input
                className="btn btn-large btn-danger"
                type="button"
                id="buttonLeaveSession"
                onClick={this.leaveSession}
                value="Leave session"
              />
              <input
                className="btn btn-large btn-success"
                type="button"
                id="buttonSwitchCamera"
                onClick={this.switchCamera}
                value="Switch Camera"
              />
            </div>

            {/* 문제가 생기는 부분.
              publisher는 1 명이고, subscriber는 n 명인데
              왜 다 publisher로 잡히는걸까? */}

            {/* body 내 body~footer 부분. */}
            <CardWrapper id="video-container">
              {/* publisher 화면이 나오게 하는 부분 */}
              {this.state.publisher !== undefined ? (
                <PublisherCard
                  className="stream-container"
                  onClick={() =>
                    this.handleMainVideoStream(this.state.publisher)
                  }
                >
                  <UserVideoComponent streamManager={this.state.publisher} />
                </PublisherCard>
              ) : null}

              {/* subscriber 화면이 나오게 하는 부분 */}
              {this.state.subscribers.map((sub, i) => (
                <SubScriberCard
                  key={sub.id}
                  className="stream-container"
                  onClick={() => this.isWinner(sub, i)}
                >
                  <span>{sub.id}</span>
                  <UserVideoComponent streamManager={sub} />
                </SubScriberCard>
              ))}
            </CardWrapper>

            {/* youtube - 안 보이게 숨겨놨음! */}
            <S.YoutubeWrapper hidden>
              <Youtube
                id="iframe"
                videoId={playlist}
                opts={{
                  width: 400,
                  height: 300,
                  playerVars: {
                    disablekb: 1, // 플레이어가 키보드 컨트롤에 응답하지 않음
                    start: 65, // 재생 구간의 시작(초)
                    end: 80, // 재생 구간의 끝(초)
                  },
                }}
                onReady={this.handleReadyMusic}
                onEnd={this.handleReadyMusic}
              />
            </S.YoutubeWrapper>

            <AllElements>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "15%",
                  gap: "10px",
                }}
              >
                <MultiSelect
                  options={options}
                  value={this.state.musicSelected}
                  onChange={this.handleMusicSelected}
                  labelledBy={"노래를 골라주세요."}
                  //isCreatable={true}
                  hasSelectAll={false}
                />
                <ShowParticipant>
                  {this.state.subscribers.length + 1}/6
                </ShowParticipant>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "15%",
                  gap: "10px",
                }}
              >
                {this.state.publisher !== undefined ? (
                  <ReadyButton
                    disabled={this.state.gameStart === false}
                    variant="contained"
                    onClick={() => this.playGame(this.state.musicSelected)}
                  >
                    게임시작
                  </ReadyButton>
                ) : null}
                <GameResultDialog
                  winnerName={this.state.winnerName}
                  answer={this.state.answer}
                  handlePlayMusic={this.handlePlayMusic}
                >
                  정답
                </GameResultDialog>

                <ExitButton variant="outlined" onClick={this.leaveSession}>
                  나가기
                </ExitButton>
              </div>
            </AllElements>
          </div>
        ) : null}
      </div>
    );
  }

  /**
   * --------------------------------------------
   * GETTING A TOKEN FROM YOUR APPLICATION SERVER
   * --------------------------------------------
   * The methods below request the creation of a Session and a Token to
   * your application server. This keeps your OpenVidu deployment secure.
   *
   * In this sample code, there is no user control at all. Anybody could
   * access your application server endpoints! In a real production
   * environment, your application server must identify the user to allow
   * access to the endpoints.
   *
   * Visit https://docs.openvidu.io/en/stable/application-server to learn
   * more about the integration of OpenVidu in your application server.
   */
  async getToken() {
    const sessionId = await this.createSession(this.state.mySessionId);
    return await this.createToken(sessionId);
  }

  async createSession(sessionId) {
    const response = await axios.post(
      APPLICATION_SERVER_URL + "rooms/create",
      { customSessionId: sessionId },
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data; // The sessionId
  }

  async createToken(sessionId) {
    const response = await axios.post(
      APPLICATION_SERVER_URL + "rooms/enter/" + sessionId,
      {},
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data.data; // The token
  }
}

export default OpenviduDefault;

// !style
// 화면 중 사람들 얼굴 보여주는 부분
const CardWrapper = styled.div`
  display: flex;
  width: 100%;
  background: #252525;
  border: 7px solid #6930c3;
  border-radius: 20px;
  border-style: outset;
`;

const PublisherCard = styled.div`
  display: inline-block;
  width: calc(100% / 5);
  height: auto;
  border-radius: 20px;
  background: #6930c3;
  margin: 1em;
  padding: 0.8em;
  box-shadow: 1px 3px 8px rgba(0, 0, 0, 100);
`;

const SubScriberCard = styled.div`
  display: inline-block;
  width: calc(100% / 5);
  height: auto;
  border-radius: 20px;
  background: #64dfdf;
  margin: 1em;
  padding: 0.8em;
  box-shadow: 1px 3px 8px rgba(0, 0, 0, 100);
`;

const AllElements = styled.div`
  display: flex;
  background: #252525;
  justify-content: space-between;
  width: 100%;
  padding: 10px;
  height: 30%;
`;

const ReadyButton = styled.button`
  width: 100%;
  height: 50px;
  padding: 10px 20px;
  border-radius: 5px;
  background: #6930c3;
  font-weight: bold;
  color: #fff;

  &:hover:not(:disabled) {
    background-color: #80ffdb;
  }

  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }
`;

const ExitButton = styled.button`
  width: 100%;
  height: 50px;
  padding: 10px 20px;
  border: 3px solid #6930c3;
  border-radius: 5px;
  font-weight: bold;
  color: #fff;
`;

const ShowParticipant = styled(Box)`
  && {
    width: 100%;
    height: 50px;
    padding: 10px 20px;
    border: 3px solid #6930c3;
    border-radius: 5px;
    text-align: center;
    font-weight: bold;
    font-size: 20px;
    color: #64dfdf;
  }
`;

const S = {
  YoutubeWrapper: styled.div`
    visibility: ${(p) => p.hidden && "hidden"};
  `,
};
