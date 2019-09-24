const AWS = require('aws-sdk');
const zlib = require('zlib');
const mcstatus = require('mcstatus');

const stepFunctions = new AWS.StepFunctions({ apiVersion: '2016-11-23' });
const MC_SHUTDOWN_ARN =
  'arn:aws:states:us-west-1:448807463524:stateMachine:mc-shutdown-when-empty';

const joinedRegex = /\: (.*) joined the game/;
const leftRegex = /\: (.*) left the game/;

const getNumPlayers = async () => {
  const status = await mcstatus.checkStatus({
    host: 'ftb.mc.ianjsikes.com',
    port: 25565,
  });
  return status.players;
};

const onPlayerJoined = async player => {
  console.log(`Player joined: ${player}`);

  // Check if state machine is currently running
  const data = await stepFunctions
    .listExecutions({
      stateMachineArn: MC_SHUTDOWN_ARN,
      statusFilter: 'RUNNING',
    })
    .promise();

  console.log('Executions data:', JSON.stringify(data));
  // Stop all running executions of state machine
  if (data.executions.length > 0) {
    console.log(`Cancelling ${data.executions.length} pending shutdowns`);
    for (const execution of data.executions) {
      await stepFunctions
        .stopExecution({
          executionArn: execution.executionArn,
        })
        .promise();
    }
  }
};

const onPlayerLeft = async player => {
  console.log(`Player left: ${player}`);
  const numPlayers = await getNumPlayers();
  console.log(`Num players: ${numPlayers}`);

  if (numPlayers === 0) {
    console.log(`Initiating shutdown procedure`);
    // Check if state machine is currently running
    const data = await stepFunctions
      .listExecutions({
        stateMachineArn: MC_SHUTDOWN_ARN,
        statusFilter: 'RUNNING',
      })
      .promise();

    console.log('Executions data:', JSON.stringify(data));
    // Stop all running executions of state machine
    if (data.executions.length > 0) {
      console.log(`Cancelling ${data.executions.length} pending shutdowns`);
      for (const execution of data.executions) {
        await stepFunctions
          .stopExecution({
            executionArn: execution.executionArn,
          })
          .promise();
      }
    }

    // Start a new execution of this state machine
    await stepFunctions
      .startExecution({
        stateMachineArn: MC_SHUTDOWN_ARN,
        input: JSON.stringify({ player }),
      })
      .promise();
    console.log(`Shutdown procedure initiated`);
  }
};

exports.handler = async (event, context) => {
  const payload = new Buffer(event.awslogs.data, 'base64');
  const parsed = JSON.parse(zlib.gunzipSync(payload).toString('utf8'));
  console.log('Decoded payload:', JSON.stringify(parsed));
  const messages = parsed.logEvents.map(event => event.message);

  for (const message of messages) {
    let joinedMatch = message.match(joinedRegex);
    let leftMatch = message.match(leftRegex);

    if (joinedMatch) {
      await onPlayerJoined(joinedMatch[1]);
    } else if (leftMatch) {
      await onPlayerLeft(leftMatch[1]);
    }
  }
  return `Successfully processed ${parsed.logEvents.length} log events.`;
};
