import { useContext } from "react";
import { ReplayContext } from "../Pages/ReplayParserPage";
import {
  Grid,
  Header,
  Message,
  Segment,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from "semantic-ui-react";
import React from "react";

import prettyMilliseconds from "pretty-ms";

import "./ReplayMainInfo.scss";

const PRODUCT_ID_TO_STRING = {
  1462982736: "Warcraft III TFT",
};

function ReplayMainInfo() {
  const { replayData, replayActions, name } = useContext(ReplayContext) || {};

  const getLeaveRowByPID = (pid?: number) => {
    return replayData?.records.playerLeave.find((i) => {
      return i.playerId === pid;
    });
  };

  return (
    <Grid className="replay-main-info">
      <Grid.Row stretched>
        <Header>Основное:</Header>
        <Segment className="fluid">
          <div>
            <b>Имя игры:</b>
            {replayData?.records.gameInfo?.gameName}
          </div>
          <div>
            <b>Product ID:</b>
            {PRODUCT_ID_TO_STRING[replayData?.subHeader.productId || 0]}
          </div>
          <div>
            <b>Версия:</b>
            {replayData?.subHeader.version} build{" "}
            {replayData?.subHeader.buildNumber}
          </div>
          <div>
            <b>Продолжительность: </b>
            {prettyMilliseconds(replayData?.subHeader.lengthMilis || 0)}
          </div>
          <div>
            <b>Хост: </b>
            {replayData?.records.gameInfo?.hostPlayer.playerName}
          </div>
        </Segment>
        <Header>Игроки:</Header>
        <Table>
          <TableHeader>
            <TableHeaderCell>Ник</TableHeaderCell>
            <TableHeaderCell>Время в игре</TableHeaderCell>
            <TableHeaderCell>Код выхода</TableHeaderCell>
          </TableHeader>
          <TableBody>
            {[
              ...(replayData?.records.players || []),
              replayData?.records.gameInfo?.hostPlayer,
            ].map((i) => {
              const leftRow = getLeaveRowByPID(i?.playerId);

              return (
                <TableRow key={i?.playerId}>
                  <TableCell>{i?.playerName}</TableCell>
                  <TableCell>
                    {prettyMilliseconds(leftRow?.time || 0)}
                  </TableCell>
                  <TableCell>{leftRow?.result}</TableCell>
                </TableRow>
              );
            })}
            <TableRow></TableRow>
          </TableBody>
        </Table>
      </Grid.Row>
      <Grid.Row>
        <Message warning>
          Мне стало дальше лень парсить это все дело, так что добро пожаловать в
          GitHub
        </Message>
      </Grid.Row>
    </Grid>
  );
}

export default ReplayMainInfo;
