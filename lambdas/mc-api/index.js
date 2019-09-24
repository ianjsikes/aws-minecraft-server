const AWS = require('aws-sdk');
const ec2 = new AWS.EC2();
// const stepFunctions = new AWS.StepFunctions({ apiVersion: '2016-11-23' });

const MC_SHUTDOWN_ARN =
  'arn:aws:states:us-west-1:448807463524:stateMachine:mc-shutdown-when-empty';
const InstanceIds = [process.env.SERVER_INSTANCE_ID];

// const instanceStatuses = [
//     'pending',
//     'running',
//     'shutting-down',
//     'terminated',
//     'stopping',
//     'stopped'
// ]

// const initiateShutdownTimer = async() => {
//   const data = await stepFunctions
//     .listExecutions({
//       stateMachineArn: MC_SHUTDOWN_ARN,
//       statusFilter: 'RUNNING',
//     })
//     .promise();

//   console.log('Executions data:', JSON.stringify(data));
//   // Stop all running executions of state machine
//   if (data.executions.length > 0) {
//     console.log(`Cancelling ${data.executions.length} pending shutdowns`);
//     for (const execution of data.executions) {
//       await stepFunctions
//         .stopExecution({
//           executionArn: execution.executionArn,
//         })
//         .promise();
//     }
//   }

//   // Start a new execution of this state machine
//   await stepFunctions
//     .startExecution({
//       stateMachineArn: MC_SHUTDOWN_ARN,
//       input: JSON.stringify({ player: null }),
//     })
//     .promise();

// }

const statusHandler = async () => {
  const res = await ec2
    .describeInstanceStatus({ InstanceIds, IncludeAllInstances: true })
    .promise();
  return { status: res['InstanceStatuses'][0].InstanceState.Name };
};

const startHandler = async () => {
  const res = await ec2.startInstances({ InstanceIds }).promise();
  // await initiateShuindtdownTimer()
  return { status: res.StartingInstances[0].CurrentState.Name };
};

const stopHandler = async () => {
  const res = await ec2.stopInstances({ InstanceIds }).promise();
  return { status: res.StoppingInstances[0].CurrentState.Name };
};

exports.handler = async (event, context, callback) => {
  const done = (err, res) =>
    callback(null, {
      statusCode: err ? '400' : '200',
      body: err ? err.message : JSON.stringify(res),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Credentials': true,
      },
    });

  if (event.httpMethod === 'OPTIONS') {
    done();
    return;
  }

  try {
    switch (event.path) {
      case '/status':
        const status = await statusHandler();
        done(null, status);
        break;
      case '/start':
        const startRes = await startHandler();
        done(null, startRes);
        break;
      case '/stop':
        const stopRes = await stopHandler();
        done(null, stopRes);
        break;
      default:
        callback(null, {
          statusCode: '404',
          body: 'Invalid endpoint',
          headers: { 'Content-Type': 'application/json' },
        });
        break;
    }
  } catch (error) {
    done(error);
  }
};
