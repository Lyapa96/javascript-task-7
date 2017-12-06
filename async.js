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
            resolve(jobs);
        }

        let jobsResults = [];
        let currentJobIndex = -1;

        for (let i = 0; i < parallelNum; i++) {
            runNextJob();
        }

        function runNextJob() {
            currentJobIndex++;

            if (jobsResults.length === jobs.length) {
                resolve(jobsResults);

                return;
            }

            let job = jobs[currentJobIndex];
            runJob(job, currentJobIndex);
        }

        function runJob(currentJob, jobIndex) {
            let errorTimeout = new Promise(resolveError => {
                setTimeout(resolveError, timeout, new Error('Promise timeout'));
            });

            return Promise.race([currentJob(), errorTimeout])
                .then(result => save(result, jobIndex))
                .catch(result => save(result, jobIndex));
        }

        function save(result, jobIndex) {
            jobsResults[jobIndex] = result;
            runNextJob();
        }
    });
}
