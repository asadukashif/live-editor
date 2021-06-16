class CodeExecutor extends Executor {
  constructor(code, language, fileExt, version, options) {
    const {
      stdin,
      args,
      run_memory_limit,
      run_timeout,
      compile_timeout,
      compile_memory_limit,
    } = options;

    this.requestObject = {
      version: version,
      language,
      files: [
        {
          name: `${new Date().toISOString()}${fileExt}`,
          content: code,
        },
      ],
      stdin: stdin || "",
      args: args || [],
      compile_timeout: compile_timeout || 10000,
      run_timeout: run_timeout || 3000,
      compile_memory_limit: compile_memory_limit || -1,
      run_memory_limit: run_memory_limit || -1,
    };
  }

  execute(callback) {
    if (!this.requestObject) throw new Error("No request has been initialized");

    fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      body: JSON.stringify(this.requestObject),
    })
      .then(res => res.json())
      .then(data => callback(data))
      .catch(err => {
        throw new Error("Request Failed " + err);
      });
  }
}

module.exports.CodeExecutor = CodeExecutor;
