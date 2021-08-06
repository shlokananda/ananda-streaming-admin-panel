import React, { useEffect } from "react";

type MusicPlayerProps = {
  file: string;
  type: string;
  onFileChange?: (value: boolean) => void;
};
const Player = ({ file, type }: MusicPlayerProps) => {
  useEffect(() => {
    console.log(file, type);
  }, [file]);
  return (
    <>
      {/* <audio controls autoPlay hidden> */}
      <audio controls id="media-player" autoPlay>
        <source src={file} type={type} />
      </audio>
    </>
  );
};

export default Player;
