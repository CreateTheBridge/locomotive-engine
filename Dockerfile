FROM ruby:2.2.0
EXPOSE 3000
MAINTAINER Joshua Tyree "joshuat@createthebridge.com"

# Update & Install core dependencies
RUN apt-get update

# Essential build
RUN apt-get install -y build-essential curl git openssl libssl-dev nodejs

# Node.js
RUN apt-get install -y nodejs

# PostgreSQL
RUN apt-get install -y postgresql postgresql-contrib libpq-dev

# Nokogiri
RUN apt-get install -y libxml2-dev libxslt1-dev

# Capybara-webkit
RUN apt-get install -y libqt4-webkit libqt4-dev xvfb

# Create app directory
ENV APP_HOME /app
RUN mkdir -p $APP_HOME
WORKDIR $APP_HOME


ADD Gemfile* $APP_HOME/
RUN /bin/bash -l -c "gem update --system"
RUN /bin/bash -l -c "gem install bundler --no-ri --no-rdoc"
RUN bundle install

ADD . $APP_HOME

ENV LOCOMOTIVE_HOST docker
ENV RAILS_ENV production
ENV SECRET_KEY_BASE a4482bbdb046012cf98ab3c2f64c5ae20cf0330136d5dbfb8bda1279fac33a4afc50a5a3322af9e41aa1359064336ddcaabf8e5b2ec58b50b99f391b05364582
RUN bundle exec rake assets:precompile --trace
CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0"]
