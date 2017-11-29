'use strict';

exports.isStar = true;
exports.runParallel = runParallel;

/** Функция паралелльно запускает указанное число промисов
 * @param {Array} jobs – функции, которые возвращают промисы
 * @param {Number} parallelNum - число одновременно исполняющихся промисов
 * @param {Number} timeout - таймаут работы промиса
 * @returns {Promise}
 */
function runParallel(jobs, parallelNum, timeout = 1000) {

    return new Promise((resolve) => {
        if (jobs.length === 0) {
            resolve([]);
        }

        let jobsResults = [];
        let currentJobIndex = -1;

        for (var i = 0; i < parallelNum; i++) {
            runNextJob();
        }

        function runNextJob() {
            currentJobIndex++;
            if (currentJobIndex >= jobs.length) {
                if (jobsResults.length === jobs.length) {
                    resolve(jobsResults);

                    return;
                }

                return;
            }

            var job = jobs[currentJobIndex];
            runJob(job, currentJobIndex);
        }

        function runJob(currentJob, jobIndex) {
            new Promise((runJobResolve, runJobReject) => {
                setTimeout(runJobReject, timeout, new Error('Promise timeout'));
                currentJob().then(runJobResolve, runJobReject);
            })
                .then(result => save(result, jobIndex))
                .catch(result => save(result, jobIndex));
        }

        function save(result, jobIndex) {
            jobsResults[jobIndex] = result;

            runNextJob();
        }
    });
}


