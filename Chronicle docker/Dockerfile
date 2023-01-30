FROM ubuntu:20.04

ENV TZ=Africa/Johannesburg
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN apt update && apt install -y git g++ make cmake libboost-dev libboost-thread-dev libboost-test-dev  libboost-filesystem-dev libboost-date-time-dev libboost-system-dev libboost-iostreams-dev  libboost-program-options-dev libboost-locale-dev libssl-dev libgmp-dev build-essential

RUN mkdir -p /opt/src/ && cd /opt/src/
RUN git clone https://github.com/EOSChronicleProject/eos-chronicle.git
RUN cd eos-chronicle \
&& git submodule update --init --recursive \
&& ./pinned_build/install_deps.sh\
&& mkdir build \
&& nice ./pinned_build/chronicle_pinned_build.sh /opt/src/chronicle-deps /opt/src/eos-chronicle/build $(nproc)

#COPY config.dev.ini /config.ini
COPY config.ini /config.ini
#Run chronicle as follows in order to create a docker container with PID 1 running chronicle in order to be ablt 
#to stop the container "docker stop" and chronicle will shutdown cleanly.
CMD ["/opt/src/eos-chronicle/build/chronicle-receiver", "--config-dir=/","--data-dir=/chronicle-data"]
# CMD ["/bin/bash", "-c", "while true; do sleep 3; done;"]